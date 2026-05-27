(function () {
  const form = document.querySelector("[data-makerspace-builder]");
  const output = document.querySelector("[data-markdown-output]");
  const status = document.querySelector("[data-status]");
  const copyButton = document.querySelector("[data-copy-markdown]");
  const downloadButton = document.querySelector("[data-download-markdown]");
  const clearButton = document.querySelector("[data-clear-form]");

  if (!form || !output) return;

  const typeLabels = {
    "tool-share": "Tool Sharing Offer",
    "learning-request": "Learning Request",
    "build-request": "Build Request",
    "repair-request": "Repair Request",
    "experiment-idea": "Experiment Idea",
    "material-offer": "Material Or Parts Offer"
  };

  const detailPrompts = {
    "tool-share": "What tool, bench, kit or space could be shared?",
    "learning-request": "What would someone like to learn?",
    "build-request": "What would someone like to build?",
    "repair-request": "What needs repair or triage?",
    "experiment-idea": "What question could become a small experiment?",
    "material-offer": "What material, parts or surplus could be offered?"
  };

  function value(name) {
    const element = form.elements[name];
    return element ? String(element.value || "").trim() : "";
  }

  function lines(text) {
    return String(text || "")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  }

  function slugify(text) {
    return String(text || "makerspace-record")
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "makerspace-record";
  }

  function today() {
    return new Date().toLocaleDateString("en-AU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  }

  function yaml(text) {
    return '"' + String(text || "TODO").replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
  }

  function bulletList(text) {
    const items = lines(text);
    if (!items.length) return "- TODO";
    return items.map((item) => "- " + item).join("\n");
  }

  function section(title, body) {
    return ["## " + title, "", body || "TODO", ""].join("\n");
  }

  function buildMarkdown() {
    const type = value("record_type") || "tool-share";
    const title = value("title") || typeLabels[type] || "Maker-Space Record";
    return [
      "---",
      "schema: straddie_makerspace_record.v0",
      "status: draft_for_human_review",
      "record_type: " + yaml(type),
      "record_label: " + yaml(typeLabels[type] || type),
      "title: " + yaml(title),
      "steward: " + yaml(value("steward")),
      "public_contact: " + yaml(value("public_contact")),
      "place_or_reach: " + yaml(value("place")),
      "prepared_date: " + yaml(today()),
      "---",
      "",
      "# " + title,
      "",
      "This file is a public-safe starter note for Straddie Maker-Space Lab. It should be checked by a human before publishing, booking, lending, repairing, testing or promising anything.",
      "",
      section("Record Type", typeLabels[type] || type),
      section("Main Details", value("details")),
      section("Useful Dates, Times Or Availability", value("availability")),
      section("Tools, Materials, Spaces Or Helpers Needed", bulletList(value("needs"))),
      section("Safety, Induction Or Permission Notes", bulletList(value("safety"))),
      section("Possible First Small Action", value("next_step")),
      section("Private Or Approval-Only Notes", bulletList(value("private_notes"))),
      section("Open Questions", bulletList(value("questions"))),
      section("Reviewer Or Next Steward", value("reviewer")),
      "## Public Boundary",
      "",
      "- A record is not permission to borrow, access, film, repair, test, sell, salvage or publish.",
      "- Private contact details, expensive gear locations, access codes and unsafe instructions should stay out of public files.",
      "- Electrical, structural, heat, dust, chemical, road-access, food-safety and machinery questions need the right human review.",
      "",
      "## Linked Public Pages",
      "",
      "- Maker-space lab: https://auraofintelligence.github.io/straddie-makerspace-lab/",
      "- Public noticeboard builder: https://auraofintelligence.github.io/straddie-noticeboard-network/public-noticeboard-builder.html",
      "- Shared assets builder: https://auraofintelligence.github.io/straddie-content-assets-kit/shared-assets-builder.html",
      "- Grants Lab: https://auraofintelligence.github.io/stradbroke-grants-lab/",
      ""
    ].join("\n");
  }

  function updateDetailLabel() {
    const type = value("record_type") || "tool-share";
    const label = form.querySelector("[data-detail-label]");
    if (!label) return;
    const textNode = [...label.childNodes].find((node) => node.nodeType === Node.TEXT_NODE);
    if (textNode) textNode.textContent = detailPrompts[type] + " ";
  }

  function saveState() {
    const state = {};
    [...form.elements].forEach((element) => {
      if (element.name) state[element.name] = element.value;
    });
    sessionStorage.setItem("straddieMakerSpaceBuilder", JSON.stringify(state));
  }

  function restoreState() {
    try {
      const state = JSON.parse(sessionStorage.getItem("straddieMakerSpaceBuilder") || "{}");
      Object.keys(state).forEach((name) => {
        if (form.elements[name]) form.elements[name].value = state[name];
      });
    } catch (error) {
      // Ignore broken session state and rebuild from the empty form.
    }
  }

  function setStatus(message) {
    if (!status) return;
    status.textContent = message;
    window.clearTimeout(setStatus.timer);
    setStatus.timer = window.setTimeout(() => {
      status.textContent = "";
    }, 2600);
  }

  function updateOutput() {
    updateDetailLabel();
    output.value = buildMarkdown();
    saveState();
  }

  form.addEventListener("input", updateOutput);
  form.addEventListener("change", updateOutput);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    updateOutput();
    setStatus("Markdown updated.");
  });

  copyButton.addEventListener("click", async () => {
    updateOutput();
    try {
      await navigator.clipboard.writeText(output.value);
      setStatus("Markdown copied.");
    } catch (error) {
      output.select();
      document.execCommand("copy");
      setStatus("Markdown selected and copied.");
    }
  });

  downloadButton.addEventListener("click", () => {
    updateOutput();
    const fileName = slugify(value("record_type") + "-" + value("title")) + ".md";
    const blob = new Blob([output.value], { type: "text/markdown;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 0);
    setStatus(fileName + " ready.");
  });

  clearButton.addEventListener("click", () => {
    sessionStorage.removeItem("straddieMakerSpaceBuilder");
    form.reset();
    updateOutput();
    setStatus("Cleared.");
  });

  restoreState();
  updateOutput();
})();
