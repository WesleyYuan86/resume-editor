const STORAGE_KEY = "resume-builder-state";

const basicFields = [
  { key: "name", label: "姓名", placeholder: "例如：张三" },
  { key: "title", label: "目标职位", placeholder: "例如：高级前端工程师" },
  { key: "phone", label: "电话", placeholder: "例如：138-0000-0000" },
  { key: "email", label: "邮箱", placeholder: "例如：name@email.com" },
  { key: "location", label: "城市", placeholder: "例如：上海" },
  { key: "website", label: "个人网站", placeholder: "例如：https://portfolio.com" },
  { key: "summary", label: "个人简介", placeholder: "一句话或一段话介绍自己", multiline: true },
];

const defaultState = {
  basics: {
    name: "林知远",
    title: "高级产品设计师 / 前端协作者",
    phone: "138-1234-5678",
    email: "lin.zhiyuan@example.com",
    location: "上海",
    website: "https://portfolio.example.com",
    summary: "擅长从 0 到 1 搭建数字产品，兼顾设计、交互和前端落地。关注信息结构、视觉叙事与业务可执行性。",
  },
  modules: [
    {
      id: createId(),
      title: "工作经历",
      description: "适合公司、职位、时间、成果等字段",
      fields: [
        { id: createId(), label: "公司", type: "text", placeholder: "公司名称" },
        { id: createId(), label: "职位", type: "text", placeholder: "岗位名称" },
        { id: createId(), label: "时间", type: "text", placeholder: "2022.01 - 至今" },
        { id: createId(), label: "内容", type: "textarea", placeholder: "描述职责、成果、指标" },
      ],
      items: [
        {
          id: createId(),
          values: {},
        },
      ],
    },
    {
      id: createId(),
      title: "项目经历",
      description: "适合项目名称、角色、亮点、技术栈等字段",
      fields: [
        { id: createId(), label: "项目", type: "text", placeholder: "项目名称" },
        { id: createId(), label: "角色", type: "text", placeholder: "你的角色" },
        { id: createId(), label: "技术栈", type: "text", placeholder: "React / Node.js / Figma ..." },
        { id: createId(), label: "亮点", type: "textarea", placeholder: "项目成果或关键难点" },
      ],
      items: [
        {
          id: createId(),
          values: {},
        },
      ],
    },
  ],
};

initializeDefaultValues(defaultState.modules);

let state = loadState();

const basicsForm = document.querySelector("#basics-form");
const modulesContainer = document.querySelector("#modules-container");
const preview = document.querySelector("#resume-preview");
const importInput = document.querySelector("#import-input");

document.querySelector("#add-module-btn").addEventListener("click", addModule);
document.querySelector("#export-btn").addEventListener("click", exportState);
document.querySelector("#import-btn").addEventListener("click", () => importInput.click());
document.querySelector("#reset-btn").addEventListener("click", resetState);
document.querySelector("#print-btn").addEventListener("click", () => window.print());
importInput.addEventListener("change", importState);

render();

function createId() {
  return Math.random().toString(36).slice(2, 10);
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return structuredClone(defaultState);
  }

  try {
    const parsed = JSON.parse(saved);
    hydrateState(parsed);
    return parsed;
  } catch (error) {
    console.error("Failed to parse saved state", error);
    return structuredClone(defaultState);
  }
}

function hydrateState(targetState) {
  targetState.basics ??= structuredClone(defaultState.basics);
  targetState.modules ??= [];
  targetState.modules.forEach((module) => {
    module.id ??= createId();
    module.title ||= "未命名模块";
    module.description ||= "";
    module.fields ??= [];
    module.items ??= [];
    module.fields.forEach((field) => {
      field.id ??= createId();
      field.label ||= "字段";
      field.type ||= "text";
      field.placeholder ||= "";
    });
    module.items.forEach((item) => {
      item.id ??= createId();
      item.values ??= {};
      module.fields.forEach((field) => {
        item.values[field.id] ??= "";
      });
    });
  });
}

function initializeDefaultValues(modules) {
  modules.forEach((module) => {
    module.items.forEach((item, index) => {
      module.fields.forEach((field) => {
        if (!(field.id in item.values)) {
          item.values[field.id] = defaultFieldValue(module.title, field.label, index);
        }
      });
    });
  });
}

function defaultFieldValue(moduleTitle, fieldLabel, index) {
  const samples = {
    工作经历: {
      公司: ["寻迹科技", "云帆互动"],
      职位: ["高级产品设计师", "交互设计师"],
      时间: ["2022.03 - 至今", "2019.07 - 2022.02"],
      内容: [
        "负责招聘平台核心产品改版，梳理信息架构并推动设计系统落地，投递转化率提升 26%。",
        "主导 B 端控制台体验升级，联合前端搭建组件库，需求交付周期缩短约 30%。",
      ],
    },
    项目经历: {
      项目: ["AI 简历工作台", "设计系统 2.0"],
      角色: ["产品设计 / 前端协作", "设计负责人"],
      技术栈: ["HTML / CSS / JavaScript", "Figma / Storybook / React"],
      亮点: [
        "搭建可自定义模块的简历编辑器，支持实时预览、本地缓存和 JSON 导出。",
        "统一组件与设计变量，支持跨团队协作，显著减少重复设计和实现偏差。",
      ],
    },
  };

  return samples[moduleTitle]?.[fieldLabel]?.[index] ?? "";
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function render() {
  renderBasicsForm();
  renderModules();
  renderPreview();
  persist();
}

function renderBasicsForm() {
  basicsForm.innerHTML = "";

  basicFields.forEach((field) => {
    const wrapper = document.createElement("div");
    wrapper.className = "field";

    const label = document.createElement("label");
    label.textContent = field.label;

    const input = field.multiline ? document.createElement("textarea") : document.createElement("input");
    input.value = state.basics[field.key] ?? "";
    input.placeholder = field.placeholder;
    input.addEventListener("input", (event) => {
      state.basics[field.key] = event.target.value;
      renderPreview();
      persist();
    });

    wrapper.append(label, input);
    basicsForm.appendChild(wrapper);
  });
}

function renderModules() {
  modulesContainer.innerHTML = "";

  if (!state.modules.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "还没有模块，点击“新增模块”开始配置。";
    modulesContainer.appendChild(empty);
    return;
  }

  state.modules.forEach((module, moduleIndex) => {
    const card = document.querySelector("#module-template").content.firstElementChild.cloneNode(true);

    const topbar = document.createElement("div");
    topbar.className = "module-topbar";
    topbar.innerHTML = `
      <strong>模块 ${moduleIndex + 1}</strong>
      <div class="inline-actions">
        <button class="mini-btn" type="button" data-action="up">上移</button>
        <button class="mini-btn" type="button" data-action="down">下移</button>
        <button class="danger-btn" type="button" data-action="delete-module">删除模块</button>
      </div>
    `;

    topbar.querySelector('[data-action="up"]').addEventListener("click", () => moveModule(moduleIndex, -1));
    topbar.querySelector('[data-action="down"]').addEventListener("click", () => moveModule(moduleIndex, 1));
    topbar.querySelector('[data-action="delete-module"]').addEventListener("click", () => deleteModule(module.id));

    const moduleHeaderFields = document.createElement("div");
    moduleHeaderFields.className = "module-header-fields";
    moduleHeaderFields.append(
      createInputField("模块标题", module.title, "例如：教育背景", (value) => {
        module.title = value;
        renderPreview();
        persist();
      }),
      createInputField("模块说明", module.description, "描述这个模块适合放什么", (value) => {
        module.description = value;
        persist();
      }),
    );

    const schemaSection = document.createElement("div");
    schemaSection.className = "field-schema";
    schemaSection.innerHTML = `
      <div class="section-toolbar">
        <strong>字段配置</strong>
        <button class="mini-btn" type="button">新增字段</button>
      </div>
    `;
    schemaSection.querySelector("button").addEventListener("click", () => addField(module.id));

    module.fields.forEach((field, fieldIndex) => {
      const row = document.createElement("div");
      row.className = "schema-row";
      row.append(
        createInputField("字段名称", field.label, "例如：学校", (value) => {
          field.label = value;
          renderPreview();
          persist();
        }),
        createSelectField("字段类型", field.type, [
          { value: "text", label: "单行文本" },
          { value: "textarea", label: "多行文本" },
        ], (value) => {
          field.type = value;
          renderModules();
          renderPreview();
          persist();
        }),
      );

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "danger-btn";
      deleteBtn.type = "button";
      deleteBtn.textContent = "删除字段";
      deleteBtn.addEventListener("click", () => deleteField(module.id, field.id));
      row.append(deleteBtn);

      schemaSection.appendChild(row);

      const placeholderRow = document.createElement("div");
      placeholderRow.className = "field-row";
      placeholderRow.append(
        createInputField("占位文本", field.placeholder, "例如：输入学校名称", (value) => {
          field.placeholder = value;
          persist();
        }),
        createStaticInfo(`字段顺序 ${fieldIndex + 1}`),
      );
      schemaSection.appendChild(placeholderRow);
    });

    const entriesSection = document.createElement("div");
    entriesSection.className = "entries";
    entriesSection.innerHTML = `
      <div class="section-toolbar">
        <strong>条目内容</strong>
        <button class="mini-btn" type="button">新增条目</button>
      </div>
    `;
    entriesSection.querySelector("button").addEventListener("click", () => addItem(module.id));

    module.items.forEach((item, itemIndex) => {
      const entryCard = document.createElement("div");
      entryCard.className = "entry-card";

      const entryHead = document.createElement("div");
      entryHead.className = "entry-head";
      entryHead.innerHTML = `<strong>条目 ${itemIndex + 1}</strong>`;

      const actions = document.createElement("div");
      actions.className = "entry-toolbar";

      const upButton = createTinyAction("上移", () => moveItem(module.id, itemIndex, -1));
      const downButton = createTinyAction("下移", () => moveItem(module.id, itemIndex, 1));
      const deleteButton = createDangerAction("删除条目", () => deleteItem(module.id, item.id));
      actions.append(upButton, downButton, deleteButton);

      entryHead.appendChild(actions);
      entryCard.appendChild(entryHead);

      const fieldsWrap = document.createElement("div");
      fieldsWrap.className = "entry-fields";

      module.fields.forEach((field) => {
        const inputField = createInputField(field.label, item.values[field.id] ?? "", field.placeholder, (value) => {
          item.values[field.id] = value;
          renderPreview();
          persist();
        }, field.type === "textarea");
        fieldsWrap.appendChild(inputField);
      });

      entryCard.appendChild(fieldsWrap);
      entriesSection.appendChild(entryCard);
    });

    card.append(topbar, moduleHeaderFields, schemaSection, entriesSection);
    modulesContainer.appendChild(card);
  });
}

function renderPreview() {
  const basics = state.basics;
  preview.innerHTML = "";

  const hero = document.createElement("section");
  hero.className = "resume-hero";

  const left = document.createElement("div");
  left.innerHTML = `
    <h1>${escapeHtml(basics.name || "你的名字")}</h1>
    <p class="headline">${escapeHtml(basics.title || "目标职位")}</p>
    <p class="summary">${escapeHtml(basics.summary || "在左侧输入你的个人简介。")}</p>
  `;

  const right = document.createElement("div");
  right.className = "contact-list";
  [
    basics.phone,
    basics.email,
    basics.location,
    basics.website,
  ].filter(Boolean).forEach((value) => {
    const item = document.createElement("div");
    item.textContent = value;
    right.appendChild(item);
  });

  hero.append(left, right);
  preview.appendChild(hero);

  state.modules.forEach((module) => {
    const section = document.createElement("section");
    section.className = "preview-section";

    const title = document.createElement("h3");
    title.textContent = module.title || "未命名模块";
    section.appendChild(title);

    const visibleItems = module.items.filter((item) =>
      module.fields.some((field) => String(item.values[field.id] || "").trim()),
    );

    if (!visibleItems.length) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "这个模块还没有填写内容。";
      section.appendChild(empty);
      preview.appendChild(section);
      return;
    }

    visibleItems.forEach((item) => {
      const article = document.createElement("article");
      article.className = "preview-item";

      const firstFieldIndex = module.fields.findIndex((field) => String(item.values[field.id] || "").trim());
      const firstValue = firstFieldIndex >= 0 ? item.values[module.fields[firstFieldIndex].id] : "";
      const header = document.createElement("p");
      header.className = "preview-item-title";
      header.textContent = firstValue;
      article.appendChild(header);

      module.fields.forEach((field, fieldIndex) => {
        if (fieldIndex === firstFieldIndex) {
          return;
        }
        const value = item.values[field.id];
        if (!String(value || "").trim()) {
          return;
        }

        const line = document.createElement("p");
        line.innerHTML = `<strong>${escapeHtml(field.label)}：</strong>${escapeHtml(value)}`;
        article.appendChild(line);
      });

      section.appendChild(article);
    });

    preview.appendChild(section);
  });
}

function createInputField(labelText, value, placeholder, onInput, multiline = false) {
  const wrapper = document.createElement("div");
  wrapper.className = "field";

  const label = document.createElement("label");
  label.textContent = labelText;

  const input = multiline ? document.createElement("textarea") : document.createElement("input");
  input.value = value ?? "";
  input.placeholder = placeholder ?? "";
  input.addEventListener("input", (event) => onInput(event.target.value));

  wrapper.append(label, input);
  return wrapper;
}

function createSelectField(labelText, value, options, onChange) {
  const wrapper = document.createElement("div");
  wrapper.className = "field";

  const label = document.createElement("label");
  label.textContent = labelText;

  const select = document.createElement("select");
  select.style.width = "100%";
  select.style.border = "1px solid rgba(86, 61, 35, 0.14)";
  select.style.background = "rgba(255, 255, 255, 0.9)";
  select.style.borderRadius = "14px";
  select.style.padding = "12px 14px";

  options.forEach((option) => {
    const element = document.createElement("option");
    element.value = option.value;
    element.textContent = option.label;
    if (option.value === value) {
      element.selected = true;
    }
    select.appendChild(element);
  });

  select.addEventListener("change", (event) => onChange(event.target.value));
  wrapper.append(label, select);
  return wrapper;
}

function createStaticInfo(text) {
  const wrapper = document.createElement("div");
  wrapper.className = "field";

  const label = document.createElement("label");
  label.textContent = "信息";

  const box = document.createElement("input");
  box.value = text;
  box.disabled = true;

  wrapper.append(label, box);
  return wrapper;
}

function createTinyAction(text, handler) {
  const button = document.createElement("button");
  button.className = "mini-btn";
  button.type = "button";
  button.textContent = text;
  button.addEventListener("click", handler);
  return button;
}

function createDangerAction(text, handler) {
  const button = document.createElement("button");
  button.className = "danger-btn";
  button.type = "button";
  button.textContent = text;
  button.addEventListener("click", handler);
  return button;
}

function addModule() {
  state.modules.push({
    id: createId(),
    title: `新模块 ${state.modules.length + 1}`,
    description: "你可以在这里定义字段结构",
    fields: [
      { id: createId(), label: "标题", type: "text", placeholder: "输入标题" },
      { id: createId(), label: "描述", type: "textarea", placeholder: "输入详细内容" },
    ],
    items: [
      {
        id: createId(),
        values: {},
      },
    ],
  });
  hydrateState(state);
  render();
}

function deleteModule(moduleId) {
  state.modules = state.modules.filter((module) => module.id !== moduleId);
  render();
}

function moveModule(index, direction) {
  const target = index + direction;
  if (target < 0 || target >= state.modules.length) {
    return;
  }
  [state.modules[index], state.modules[target]] = [state.modules[target], state.modules[index]];
  render();
}

function addField(moduleId) {
  const module = state.modules.find((item) => item.id === moduleId);
  if (!module) {
    return;
  }
  const fieldId = createId();
  module.fields.push({
    id: fieldId,
    label: `字段 ${module.fields.length + 1}`,
    type: "text",
    placeholder: "请输入内容",
  });
  module.items.forEach((item) => {
    item.values[fieldId] = "";
  });
  render();
}

function deleteField(moduleId, fieldId) {
  const module = state.modules.find((item) => item.id === moduleId);
  if (!module) {
    return;
  }
  module.fields = module.fields.filter((field) => field.id !== fieldId);
  module.items.forEach((item) => {
    delete item.values[fieldId];
  });
  render();
}

function addItem(moduleId) {
  const module = state.modules.find((item) => item.id === moduleId);
  if (!module) {
    return;
  }
  const values = {};
  module.fields.forEach((field) => {
    values[field.id] = "";
  });
  module.items.push({
    id: createId(),
    values,
  });
  render();
}

function deleteItem(moduleId, itemId) {
  const module = state.modules.find((item) => item.id === moduleId);
  if (!module) {
    return;
  }
  module.items = module.items.filter((item) => item.id !== itemId);
  render();
}

function moveItem(moduleId, index, direction) {
  const module = state.modules.find((item) => item.id === moduleId);
  if (!module) {
    return;
  }
  const target = index + direction;
  if (target < 0 || target >= module.items.length) {
    return;
  }
  [module.items[index], module.items[target]] = [module.items[target], module.items[index]];
  render();
}

function exportState() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "resume-data.json";
  anchor.click();
  URL.revokeObjectURL(url);
}

function importState(event) {
  const [file] = event.target.files || [];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      hydrateState(parsed);
      state = parsed;
      render();
    } catch (error) {
      alert("导入失败：JSON 格式不正确。");
      console.error("Import failed", error);
    } finally {
      importInput.value = "";
    }
  };
  reader.readAsText(file, "utf-8");
}

function resetState() {
  state = structuredClone(defaultState);
  persist();
  render();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
