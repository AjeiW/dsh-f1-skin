// dsh-f1-skin client runtime. Global appearance uses the theme service;
    // all controls render inside DSH's native settings.section slot.
    const React = require("react");
    const h = React.createElement;
    const SOURCE = "dsh-f1-skin";
    const STORE = {
      team: "dsh-f1-skin:team",
      photo: "dsh-f1-skin:photo",
      surface: "dsh-f1-skin:surface",
      blur: "dsh-f1-skin:blur",
      motion: "dsh-f1-skin:motion"
    };
    const DEFAULTS = { photo: 100, surface: 84, blur: 10, motion: true };
    let applySerial = 0;

    function findTeam(id) {
      for (const team of TEAMS) if (team.id === id) return team;
      return TEAMS[0];
    }

    function readStore(key) {
      try { return localStorage.getItem(key); } catch { return null; }
    }

    function writeStore(key, value) {
      try { localStorage.setItem(key, String(value)); } catch { /* private mode */ }
    }

    function readBoundedNumber(key, fallback, min, max) {
      const stored = readStore(key);
      if (stored === null || stored === "") return fallback;
      const parsed = Number(stored);
      return Number.isFinite(parsed) ? Math.max(min, Math.min(max, parsed)) : fallback;
    }

    function readPreferences() {
      return {
        photo: readBoundedNumber(STORE.photo, DEFAULTS.photo, 65, 100),
        surface: readBoundedNumber(STORE.surface, DEFAULTS.surface, 76, 96),
        blur: readBoundedNumber(STORE.blur, DEFAULTS.blur, 0, 20),
        motion: readStore(STORE.motion) !== "off"
      };
    }

    function applyPreferences(prefs) {
      const root = document.documentElement;
      root.style.setProperty("--f1-photo-strength", `${prefs.photo}%`);
      root.style.setProperty("--f1-surface-strength", `${prefs.surface}%`);
      root.style.setProperty("--f1-blur", `${prefs.blur}px`);
      root.setAttribute("data-f1-motion", prefs.motion ? "on" : "off");
    }

    function syncDarkMode(ctx) {
      const applyAttr = () => {
        const dark = document.body.hasAttribute("data-ds-dark-theme");
        document.documentElement.setAttribute("data-f1-dark", dark ? "true" : "false");
      };
      applyAttr();
      ctx.effect(() => {
        const observer = new MutationObserver(applyAttr);
        observer.observe(document.body, { attributes: true, attributeFilter: ["data-ds-dark-theme"] });
        return () => observer.disconnect();
      }, "dsh-f1-skin: dark-mode sync");
    }

    function applyTeam(runtime, theme, team) {
      if (runtime.lastTeamId !== team.id || runtime.tokenDisposer === null) {
        const nextDisposer = theme.overrideTokens(runtime.source, makeTeamTokens(team));
        runtime.tokenDisposer = nextDisposer;
        runtime.lastTeamId = team.id;
      }
      const root = document.documentElement;
      root.style.setProperty("--f1-accent-dark", team.dark.brand);
      root.style.setProperty("--f1-accent-light", team.light.brand);
      root.style.setProperty("--f1-accent-text-dark", team.dark.brandText);
      root.style.setProperty("--f1-accent-text-light", team.light.brandText);
      root.style.setProperty("--f1-secondary", team.dark.biz);
      root.style.setProperty("--f1-on-accent-dark", team.onBrandDark);
      root.style.setProperty("--f1-on-accent-light", team.onBrandLight);
      root.style.setProperty("--f1-tint", team.tint);
      root.style.setProperty("--f1-cockpit", `url("${team.cockpit}")`);
      root.style.setProperty("--f1-team-logo", `url("${team.logo}")`);
      root.style.setProperty("--f1-cockpit-position", team.position || "center");
      root.style.setProperty("--f1-cockpit-mobile-position", team.mobilePosition || team.position || "center");
      root.style.setProperty("--f1-panel-dark", team.dark.layer1);
      root.style.setProperty("--f1-panel-2-dark", team.dark.layer2);
      root.style.setProperty("--f1-panel-light", team.light.layer1);
      root.style.setProperty("--f1-panel-2-light", team.light.platform);
      root.style.setProperty("--f1-success-dark", team.dark.success);
      root.style.setProperty("--f1-success-light", team.light.success);
      root.style.setProperty("--f1-warning-dark", team.dark.warn);
      root.style.setProperty("--f1-warning-light", team.light.warn);
      root.style.setProperty("--f1-danger-dark", team.dark.error);
      root.style.setProperty("--f1-danger-light", team.light.error);
      root.setAttribute("data-f1-team", team.id);
      root.setAttribute("data-f1-personality", team.personality);
      root.setAttribute("data-f1-instance", runtime.id);
      writeStore(STORE.team, team.id);
      runtime.emit();
    }

    function installCss(ctx, runtime) {
      ctx.effect(() => {
        const tag = document.createElement("style");
        tag.dataset.plugin = "dsh-f1-skin";
        tag.dataset.pluginCss = "dsh-f1-skin/native-settings.css";
        tag.dataset.f1Instance = runtime.id;
        tag.textContent = F1_CSS;
        document.head.appendChild(tag);
        return () => tag.remove();
      }, "dsh-f1-skin: stylesheet");
    }

    function createSettingsSection(runtime) {
      return function F1SettingsSection() {
        const [snapshot, setSnapshot] = React.useState(() => runtime.snapshot());
        React.useEffect(() => runtime.subscribe(setSnapshot), []);

        const teamCards = TEAMS.map((team) => h("button", {
          type: "button",
          key: team.id,
          className: "dsh-f1-team-card",
          "aria-pressed": snapshot.teamId === team.id,
          onClick: () => runtime.selectTeam(team.id),
          style: {
            "--team-color-dark": team.dark.brandText,
            "--team-color-light": team.light.brandText,
            "--team-position": team.position || "center"
          }
        },
        h("span", {
          className: "dsh-f1-team-card__image",
          "aria-hidden": "true",
          style: { backgroundImage: `url("${team.cockpit}")` }
        }),
        h("span", { className: "dsh-f1-team-card__body" },
          h("strong", { className: "dsh-f1-team-card__name" }, team.name),
          h("span", {
            className: "dsh-f1-team-card__mark",
            "aria-hidden": "true",
            style: { backgroundImage: `url("${team.logo}")` }
          })
        )));

        const range = (key, label, min, max, suffix) => h("label", {
          className: "dsh-f1-setting",
          key
        },
        h("span", { className: "dsh-f1-setting__label" }, label),
        h("input", {
          type: "range",
          min,
          max,
          step: 1,
          value: snapshot[key],
          onChange: (event) => runtime.setPreference(key, Number(event.target.value))
        }),
        h("output", null, `${snapshot[key]}${suffix}`));

        const current = findTeam(snapshot.teamId);
        return h("section", { className: "dsh-f1-settings", "aria-label": "Formula One 车队皮肤" },
          h("header", { className: "dsh-f1-settings__header" },
            h("div", null,
              h("div", { className: "dsh-f1-settings__eyebrow" }, "RACE CONTROL / TEAM GARAGE"),
              h("h2", { className: "dsh-f1-settings__title" }, "Formula One 车队皮肤"),
              h("p", { className: "dsh-f1-settings__description" },
                "选择车队并调节背景表现。设置页沿用 DSH 原生布局，皮肤不会改变宿主控件尺寸。")),
            h("div", { className: "dsh-f1-settings__status" }, current.name)
          ),
          h("div", { className: "dsh-f1-settings__grid" }, teamCards),
          h("section", { className: "dsh-f1-settings__panel", "aria-label": "视觉强度" },
            h("h3", { className: "dsh-f1-settings__panel-title" }, "视觉强度"),
            h("p", { className: "dsh-f1-settings__panel-hint" },
              "背景与文字表面分开调节；原生设置页、菜单和弹窗始终保持完整宽度。"),
            range("photo", "背景图片", 65, 100, "%"),
            range("surface", "文字衬底", 76, 96, "%"),
            range("blur", "背景模糊", 0, 20, "PX"),
            h("label", { className: "dsh-f1-setting" },
              h("span", { className: "dsh-f1-setting__label" }, "动态效果"),
              h("input", {
                type: "checkbox",
                checked: snapshot.motion,
                onChange: (event) => runtime.setPreference("motion", event.target.checked)
              }),
              h("output", null, snapshot.motion ? "ON" : "OFF"))
          )
        );
      };
    }

    const inject = ["theme", "slots"];

    function apply(ctx) {
      const theme = ctx.get("theme");
      const serial = ++applySerial;
      const instanceId = `${Date.now().toString(36)}-${serial.toString(36)}-${Math.random().toString(36).slice(2)}`;
      const listeners = new Set();
      const runtime = {
        id: instanceId,
        source: SOURCE,
        tokenDisposer: null,
        lastTeamId: null,
        prefs: readPreferences(),
        snapshot() {
          return { teamId: this.lastTeamId || TEAMS[0].id, ...this.prefs };
        },
        emit() {
          const next = this.snapshot();
          for (const listener of listeners) listener(next);
        },
        subscribe(listener) {
          listeners.add(listener);
          listener(this.snapshot());
          return () => listeners.delete(listener);
        },
        selectTeam(id) {
          applyTeam(this, theme, findTeam(id));
        },
        setPreference(key, value) {
          if (!(key in this.prefs)) return;
          this.prefs = { ...this.prefs, [key]: value };
          writeStore(STORE[key], key === "motion" ? (value ? "on" : "off") : value);
          applyPreferences(this.prefs);
          this.emit();
        }
      };

      installCss(ctx, runtime);
      syncDarkMode(ctx);
      applyPreferences(runtime.prefs);
      applyTeam(runtime, theme, findTeam(readStore(STORE.team)));

      const SettingsSection = createSettingsSection(runtime);
      ctx.slots.inject("settings.section", () => ctx.slots.register({
        name: "settings.section",
        id: "dsh-f1-garage",
        order: 32,
        label: () => "Formula One 车队"
      }, SettingsSection));

      ctx.on("dispose", () => {
        listeners.clear();
        if (runtime.tokenDisposer) runtime.tokenDisposer();
        runtime.tokenDisposer = null;
        const root = document.documentElement;
        if (root.getAttribute("data-f1-instance") !== runtime.id) return;
        for (const name of [
          "--f1-accent-dark", "--f1-accent-light", "--f1-accent-text-dark", "--f1-accent-text-light",
          "--f1-secondary", "--f1-on-accent-dark", "--f1-on-accent-light", "--f1-tint",
          "--f1-cockpit", "--f1-team-logo", "--f1-cockpit-position", "--f1-cockpit-mobile-position", "--f1-panel-dark",
          "--f1-panel-2-dark", "--f1-panel-light", "--f1-panel-2-light", "--f1-success-dark",
          "--f1-success-light", "--f1-warning-dark", "--f1-warning-light", "--f1-danger-dark",
          "--f1-danger-light", "--f1-photo-strength", "--f1-surface-strength", "--f1-blur"
        ]) root.style.removeProperty(name);
        for (const name of [
          "data-f1-team", "data-f1-personality", "data-f1-dark",
          "data-f1-motion", "data-f1-instance"
        ]) root.removeAttribute(name);
      });
    }

    exports.inject = inject;
    exports.apply = apply;
