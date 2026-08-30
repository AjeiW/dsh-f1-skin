// dsh-f1-skin client plugin body. Concatenated by scripts/build.mjs into the
// bundle factory after the data preamble (ALL_TOKENS, TOKEN_MAP, TEAMS,
// F1_CSS, makeTeamTokens, color helpers are in scope).
    const SOURCE = "dsh-f1-skin";
    const STORE_KEY = "dsh-f1-skin:team";

    let railEl = null;
    let tokenDisposer = null;
    let lastTeamId = null;

    function findTeam(id) {
      for (const team of TEAMS) if (team.id === id) return team;
      return TEAMS[0];
    }

    function readStoredTeam() {
      try {
        return localStorage.getItem(STORE_KEY);
      } catch {
        return null;
      }
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

    function applyTeam(theme, team) {
      if (lastTeamId === team.id && tokenDisposer) return tokenDisposer;
      lastTeamId = team.id;
      tokenDisposer = theme.overrideTokens(SOURCE, makeTeamTokens(team));
      const root = document.documentElement;
      root.style.setProperty("--f1-accent", team.dark.brand);
      root.style.setProperty("--f1-accent-light", team.light.brand);
      root.style.setProperty("--f1-tint", team.tint);
      root.style.setProperty("--f1-cockpit", `url("${team.cockpit}")`);
      try {
        localStorage.setItem(STORE_KEY, team.id);
      } catch { /* private mode — keep in-memory */ }
      if (railEl) for (const dot of railEl.querySelectorAll(".f1-dot")) dot.classList.toggle("active", dot.dataset.team === team.id);
      return tokenDisposer;
    }

    function installRail(ctx, theme) {
      ctx.effect(() => {
        const rail = document.createElement("div");
        rail.id = "dsh-f1-rail";
        rail.setAttribute("role", "group");
        rail.setAttribute("aria-label", "F1 team skin");
        for (const team of TEAMS) {
          const dot = document.createElement("button");
          dot.type = "button";
          dot.className = "f1-dot";
          dot.dataset.team = team.id;
          dot.title = `F1 · ${team.name}`;
          dot.setAttribute("aria-label", team.name);
          dot.style.background = team.dark.brand;
          dot.addEventListener("click", () => applyTeam(theme, team));
          rail.appendChild(dot);
        }
        document.body.appendChild(rail);
        railEl = rail;
        return () => {
          rail.remove();
          railEl = null;
        };
      }, "dsh-f1-skin: team rail");
    }

    function installCss(ctx) {
      ctx.effect(() => {
        const tag = document.createElement("style");
        tag.dataset.plugin = "dsh-f1-skin";
        tag.dataset.pluginCss = "dsh-f1-skin/f1.css";
        tag.textContent = F1_CSS;
        document.head.appendChild(tag);
        return () => tag.remove();
      }, "dsh-f1-skin: stylesheet");
    }

    const inject = ["theme"];

    function apply(ctx) {
      const theme = ctx.get("theme");
      installCss(ctx);
      installRail(ctx, theme);
      syncDarkMode(ctx);
      applyTeam(theme, findTeam(readStoredTeam()));
      ctx.on("dispose", () => {
        if (tokenDisposer) tokenDisposer();
      });
    }

    exports.inject = inject;
    exports.apply = apply;
