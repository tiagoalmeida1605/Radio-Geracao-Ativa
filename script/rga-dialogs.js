(function () {
    "use strict";

    const existing = window.RGA && typeof window.RGA === "object" ? window.RGA : {};
    const RGA = existing;
    const activeModals = [];
    let toastContainer = null;
    let toastSequence = 0;

    function createIcon(name) {
        const icon = document.createElement("i");
        icon.dataset.lucide = name;
        icon.setAttribute("aria-hidden", "true");
        return icon;
    }

    function refreshIcons() {
        if (window.lucide && typeof window.lucide.createIcons === "function") {
            window.lucide.createIcons();
        }
    }

    function normalizeText(value, fallback) {
        if (typeof value === "string" && value.trim()) {
            return value.trim();
        }
        return fallback;
    }

    function normalizeType(value, allowed, fallback) {
        return allowed.includes(value) ? value : fallback;
    }

    function getToastContainer() {
        if (toastContainer && toastContainer.isConnected) {
            return toastContainer;
        }

        toastContainer = document.createElement("div");
        toastContainer.className = "rga-toast-container";
        toastContainer.setAttribute("role", "region");
        toastContainer.setAttribute("aria-label", "Notificações");
        toastContainer.setAttribute("aria-live", "polite");
        toastContainer.setAttribute("aria-relevant", "additions");
        document.body.appendChild(toastContainer);
        return toastContainer;
    }

    function toast(options) {
        const config = options && typeof options === "object" ? options : { message: String(options || "") };
        const type = normalizeType(config.type, ["success", "error", "warning", "info"], "info");
        const title = normalizeText(config.title, type === "success" ? "Concluído" :
            type === "error" ? "Erro" : type === "warning" ? "Atenção" : "Informação");
        const message = normalizeText(config.message, "");
        const duration = Number.isFinite(config.duration) ? Math.max(2500, config.duration) : (type === "error" ? 7000 : 4500);
        const container = getToastContainer();
        const element = document.createElement("div");
        const sequence = ++toastSequence;
        element.className = `rga-toast rga-toast--${type}`;
        element.dataset.toastSequence = String(sequence);
        element.setAttribute("role", type === "error" ? "alert" : "status");

        const iconNames = {
            success: "circle-check",
            error: "circle-alert",
            warning: "triangle-alert",
            info: "info"
        };

        const icon = document.createElement("span");
        icon.className = "rga-toast-icon";
        icon.appendChild(createIcon(iconNames[type]));

        const content = document.createElement("div");
        content.className = "rga-toast-content";
        const heading = document.createElement("strong");
        heading.className = "rga-toast-title";
        heading.textContent = title;
        content.appendChild(heading);
        if (message) {
            const text = document.createElement("p");
            text.className = "rga-toast-message";
            text.textContent = message;
            content.appendChild(text);
        }

        const close = document.createElement("button");
        close.type = "button";
        close.className = "rga-toast-close";
        close.setAttribute("aria-label", "Fechar notificação");
        close.appendChild(createIcon("x"));

        element.append(icon, content, close);
        container.appendChild(element);
        refreshIcons();

        let timer = null;
        let removing = false;

        function removeToast() {
            if (removing) return;
            removing = true;
            clearTimeout(timer);
            element.classList.add("rga-toast--leaving");
            window.setTimeout(() => element.remove(), 180);
        }

        close.addEventListener("click", removeToast);
        timer = window.setTimeout(removeToast, duration);
        return { id: sequence, close: removeToast };
    }

    function lockPageIfNeeded() {
        if (activeModals.length === 1) {
            document.body.classList.add("rga-dialog-open");
            const modal = activeModals[0];
            modal.inertElements = [];
            Array.from(document.body.children).forEach((element) => {
                if (element.classList.contains("rga-dialog-overlay") || element.classList.contains("rga-toast-container")) {
                    return;
                }
                if (!element.hasAttribute("inert")) {
                    element.setAttribute("inert", "");
                    element.setAttribute("data-rga-dialog-inert", "");
                    modal.inertElements.push(element);
                }
            });
        }
    }

    function unlockPageIfNeeded() {
        if (activeModals.length === 0) {
            document.body.classList.remove("rga-dialog-open");
            Array.from(document.querySelectorAll("[data-rga-dialog-inert]")).forEach((element) => {
                element.removeAttribute("inert");
                element.removeAttribute("data-rga-dialog-inert");
            });
        }
    }

    function openModal(options) {
        const config = options && typeof options === "object" ? options : {};
        const kind = normalizeType(config.kind, ["alert", "confirm", "prompt"], "alert");
        const type = normalizeType(config.type, ["info", "success", "warning", "error", "danger"], "info");
        const title = normalizeText(config.title, kind === "confirm" ? "Confirmar ação" : "Informação");
        const message = normalizeText(config.message, "");
        const escapeEnabled = config.escape !== false;
        const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        const overlay = document.createElement("div");
        const dialog = document.createElement("section");
        const titleId = `rga-dialog-title-${Date.now()}-${activeModals.length}`;
        const messageId = `rga-dialog-message-${Date.now()}-${activeModals.length}`;

        overlay.className = "rga-dialog-overlay";
        overlay.dataset.rgaDialogOpen = "true";
        dialog.className = `rga-dialog rga-dialog--${type}`;
        dialog.setAttribute("role", kind === "alert" ? "alertdialog" : "dialog");
        dialog.setAttribute("aria-modal", "true");
        dialog.setAttribute("aria-labelledby", titleId);
        if (message) dialog.setAttribute("aria-describedby", messageId);
        dialog.tabIndex = -1;

        const header = document.createElement("div");
        header.className = "rga-dialog-header";
        const iconNames = {
            success: "circle-check",
            error: "circle-alert",
            danger: "triangle-alert",
            warning: "triangle-alert",
            info: "info"
        };
        const icon = document.createElement("span");
        icon.className = "rga-dialog-icon";
        icon.appendChild(createIcon(iconNames[type] || "info"));

        const heading = document.createElement("h2");
        heading.className = "rga-dialog-title";
        heading.id = titleId;
        heading.textContent = title;

        const close = document.createElement("button");
        close.type = "button";
        close.className = "rga-dialog-close";
        close.setAttribute("aria-label", "Fechar diálogo");
        close.appendChild(createIcon("x"));
        header.append(icon, heading, close);

        const body = document.createElement("div");
        body.className = "rga-dialog-body";
        if (message) {
            const text = document.createElement("p");
            text.className = "rga-dialog-message";
            text.id = messageId;
            text.textContent = message;
            body.appendChild(text);
        }

        let input = null;
        let validation = null;
        if (kind === "prompt") {
            input = document.createElement("input");
            input.type = "text";
            input.className = "rga-dialog-input";
            input.placeholder = normalizeText(config.placeholder, "");
            input.value = typeof config.initialValue === "string" ? config.initialValue : "";
            input.setAttribute("aria-label", normalizeText(config.label, title));
            validation = document.createElement("p");
            validation.className = "rga-dialog-validation";
            validation.setAttribute("role", "alert");
            validation.hidden = true;
            body.append(input, validation);
            if (message) input.setAttribute("aria-describedby", messageId);
        }

        const actions = document.createElement("div");
        actions.className = "rga-dialog-actions";
        const cancel = document.createElement("button");
        cancel.type = "button";
        cancel.className = "rga-dialog-button rga-dialog-button--secondary";
        cancel.textContent = normalizeText(config.cancelText, "Cancelar");
        const confirm = document.createElement("button");
        confirm.type = "button";
        confirm.className = `rga-dialog-button rga-dialog-button--primary${type === "danger" ? " rga-dialog-button--danger" : ""}`;
        confirm.textContent = normalizeText(config.confirmText, kind === "alert" ? "Entendi" : "Confirmar");
        if (kind !== "alert") actions.append(cancel);
        actions.append(confirm);

        dialog.append(header, body, actions);
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
        activeModals.push({ overlay, dialog, previouslyFocused });
        lockPageIfNeeded();
        refreshIcons();

        let settled = false;
        const resolver = Promise.withResolvers ? Promise.withResolvers() : (() => {
            let resolve;
            const promise = new Promise((done) => { resolve = done; });
            return { promise, resolve };
        })();

        function getFocusable() {
            return Array.from(dialog.querySelectorAll(
                'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
            )).filter((element) => !element.hidden && element.offsetParent !== null);
        }

        function settle(value) {
            if (settled) return;
            settled = true;
            overlay.classList.add("rga-dialog-overlay--leaving");
            dialog.classList.add("rga-dialog--leaving");
            window.setTimeout(() => {
                const index = activeModals.findIndex((item) => item.overlay === overlay);
                if (index >= 0) activeModals.splice(index, 1);
                overlay.remove();
                unlockPageIfNeeded();
                if (previouslyFocused && previouslyFocused.isConnected) {
                    previouslyFocused.focus();
                }
                resolver.resolve(value);
            }, 160);
        }

        overlay.addEventListener("mousedown", (event) => {
            if (event.target === overlay && escapeEnabled) settle(kind === "confirm" ? false : (kind === "prompt" ? null : undefined));
        });

        close.addEventListener("click", () => {
            settle(kind === "confirm" ? false : (kind === "prompt" ? null : undefined));
        });
        cancel.addEventListener("click", () => {
            settle(kind === "prompt" ? null : false);
        });
        confirm.addEventListener("click", () => {
            if (kind === "prompt") {
                const value = input.value.trim();
                if (config.required && !value) {
                    validation.textContent = normalizeText(config.validationMessage, "Este campo é obrigatório.");
                    validation.hidden = false;
                    input.setAttribute("aria-invalid", "true");
                    input.focus();
                    return;
                }
                settle(value);
                return;
            }
            settle(kind === "confirm" ? true : undefined);
        });

        dialog.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && escapeEnabled) {
                event.preventDefault();
                settle(kind === "confirm" ? false : (kind === "prompt" ? null : undefined));
                return;
            }
            if (kind === "prompt" && event.key === "Enter" && event.target === input) {
                event.preventDefault();
                confirm.click();
                return;
            }
            if (event.key === "Tab") {
                const elements = getFocusable();
                if (!elements.length) return;
                const first = elements[0];
                const last = elements[elements.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
        });

        window.requestAnimationFrame(() => {
            const initial = kind === "prompt" && input ? input : (kind === "confirm" ? cancel : confirm);
            initial.focus();
        });

        return resolver.promise;
    }

    RGA.toast = toast;
    RGA.alert = (options) => openModal({ ...(options && typeof options === "object" ? options : { message: String(options || "") }), kind: "alert" });
    RGA.confirm = (options) => openModal({ ...(options && typeof options === "object" ? options : { message: String(options || "") }), kind: "confirm" });
    RGA.prompt = (options) => openModal({ ...(options && typeof options === "object" ? options : { message: String(options || "") }), kind: "prompt" });
    RGA.dialogs = RGA.dialogs && typeof RGA.dialogs === "object" ? RGA.dialogs : {};
    RGA.dialogs.toast = toast;
    RGA.dialogs.alert = RGA.alert;
    RGA.dialogs.confirm = RGA.confirm;
    RGA.dialogs.prompt = RGA.prompt;
    window.RGA = RGA;
})();
