let gold = 9;
    let clickValue = 1;
    let critrate = 5;
    let critdamage = 150;
    let upgradePrice = 16;
    let cooldown = 2000; // ms
    const minCooldown = 200;
    const maxCritRate = 70;
    const maxCritDamage = 250;
    let cooldownPrice = 30;
    let duplicatePrice = 35;
    let autoClickerPrice = 500;
    let upgradeCritRateCost = 30;
    let upgradeCritDamageCost = 45;

    const goldText = document.getElementById("gold");
    const buttonContainer = document.getElementById("buttonContainer");
    const autoButtonContainer = document.getElementById("autoButtonContainer");
    const notif = document.getElementById("notif");

    const dupBtn = document.getElementById("dupBtn");
    const clickUpBtn = document.getElementById("clickUpBtn");
    const autoBtn = document.getElementById("autoBtn");
    const cdBtn = document.getElementById("cdBtn");
    const cdmBtn = document.getElementById("cdmBtn");
    const crtBtn = document.getElementById("crtBtn");

    let autoClickers = 0;
    let autoLoopRunning = false;

    function showNotif(msg, color="green") {
      notif.textContent = msg;
      notif.style.color = color;
      clearTimeout(showNotif._t);
      showNotif._t = setTimeout(() => notif.textContent = "", 1500);
    }

    function updateGold() { goldText.textContent = gold; }

    function clickButton(btn) {
      if (btn.classList.contains("disabled")) return;
      let rng = Math.random() * 100;
      let goldEarned = clickValue;
      if (rng < critrate) {
        goldEarned = Math.floor(clickValue * (critdamage / 100));
        showNotif("💥 CRIT +" + goldEarned, "orange");
      }
      gold += goldEarned;
      updateGold();

      btn.classList.add("disabled");
      setTimeout(() => btn.classList.remove("disabled"), cooldown);
    }

    function upgradeClick() {
      if (gold >= upgradePrice) {
        gold -= upgradePrice;
        clickValue *= 2;
        upgradePrice = Math.floor(upgradePrice * 2.5);
        updateGold();
        updateUI();
        showNotif("Click power upgraded! Now " + clickValue + " gold/click.", "blue");
      } else showNotif("Not enough gold!", "red");
    }

    function duplicateButton() {
      if (gold >= duplicatePrice) {
        gold -= duplicatePrice;
        updateGold();

        const newBtn = document.createElement("div");
        newBtn.className = "click-button";
        newBtn.textContent = "CLICK";
        newBtn.onclick = () => clickButton(newBtn);

        const buttons = Array.from(buttonContainer.children);
        let inserted = false;
        for (let i=0; i<buttons.length; i++) {
          if (buttons[i].style.order === "") {
            buttonContainer.insertBefore(newBtn, buttons[i]);
            inserted = true;
            break;
          }
        }
        if (!inserted) buttonContainer.appendChild(newBtn);

        duplicatePrice = Math.floor(duplicatePrice * 2.5);
        updateUI();
        showNotif("New button spawned!", "purple");
      } else showNotif("Not enough gold!", "red");
    }

    function upgradeCooldown() {
      if (cooldown <= minCooldown) {
        cdBtn.textContent = "Cooldown MAXED";
        cdBtn.disabled = true;
        cdBtn.style.backgroundColor = "white";
        showNotif("Cooldown sudah maksimum!", "red");
        return;
      }
      if (gold >= cooldownPrice) {
        gold -= cooldownPrice;
        updateGold();
        cooldown = Math.max(minCooldown, cooldown - 50);
        cooldownPrice = Math.floor(cooldownPrice * 1.6);
        updateUI();
        showNotif("Cooldown reduced! Now " + (cooldown / 1000).toFixed(2) + "s", "orange");
      } else showNotif("Not enough gold!", "red");
    }

    function buyAutoClicker() {
      if (gold >= autoClickerPrice) {
        gold -= autoClickerPrice;
        updateGold();

        autoClickers++;
        autoClickerPrice = Math.floor(autoClickerPrice * 2.2);

        const autoBtnEl = document.createElement("div");
        autoBtnEl.className = "click-button";
        autoBtnEl.textContent = "AUTO";

        const autoButtons = Array.from(autoButtonContainer.children);
        let inserted = false;
        for (let i=0; i<autoButtons.length; i++) {
          if (autoButtons[i].style.order === "") {
            autoButtonContainer.insertBefore(autoBtnEl, autoButtons[i]);
            inserted = true;
            break;
          }
        }
        if (!inserted) autoButtonContainer.appendChild(autoBtnEl);

        updateUI();
        showNotif("Bought Auto Clicker! Total: " + autoClickers, "teal");

        startAutoClicker();
      } else showNotif("Not enough gold!", "red");
    }

    function startAutoClicker() {
      if (autoLoopRunning) return;
      autoLoopRunning = true;

      (function autoLoop() {
        const autoButtons = Array.from(autoButtonContainer.children);
        autoButtons.forEach(btn => clickButton(btn));
        setTimeout(autoLoop, cooldown);
      })();
    }

    function upgradeCritRate() {
      if (critrate >= maxCritRate) {
        showNotif("Crit Rate sudah maksimum!", "red");
        updateUI();
        return;
      }

      if (gold >= upgradeCritRateCost) {
        gold -= upgradeCritRateCost;
        critrate = Math.min(maxCritRate, critrate + 2);
        upgradeCritRateCost = Math.floor(upgradeCritRateCost * 1.7);
        showNotif("Crit Rate +2% → " + critrate + "%", "blue");
        updateGold();
      } else showNotif("Not enough gold!", "red");

      updateUI();
    }

    function upgradeCritDamage() {
      if (critdamage >= maxCritDamage) {
        showNotif("Crit Damage sudah maksimum!", "red");
        updateUI();
        return;
      }

      if (gold >= upgradeCritDamageCost) {
        gold -= upgradeCritDamageCost;
        critdamage = Math.min(maxCritDamage, critdamage + 5);
        upgradeCritDamageCost = Math.floor(upgradeCritDamageCost * 2.2);
        showNotif("Crit Damage +5% → " + critdamage + "%", "blue");
        updateGold();
      } else showNotif("Not enough gold!", "red");

      updateUI();
    }

    function updateUI() {
      goldText.textContent = gold;
      document.getElementById("critRate").textContent = critrate;
      document.getElementById("critDamage").textContent = critdamage;

      if (critrate >= maxCritRate) {
        crtBtn.textContent = "Crit Rate MAXED";
        crtBtn.disabled = true;
        crtBtn.style.backgroundColor = "white";
        crtBtn.style.cursor = "not-allowed";
      } else {
        crtBtn.textContent = "Crit Rate +2% (" + upgradeCritRateCost + " Gold)";
        crtBtn.disabled = false;
        crtBtn.style.backgroundColor = "";
        crtBtn.style.cursor = "pointer";
      }

      if (critdamage >= maxCritDamage) {
        cdmBtn.textContent = "Crit Damage MAXED";
        cdmBtn.disabled = true;
        cdmBtn.style.backgroundColor = "white";
        cdmBtn.style.cursor = "not-allowed";
      } else {
        cdmBtn.textContent = "Crit Damage +5% (" + upgradeCritDamageCost + " Gold)";
        cdmBtn.disabled = false;
        cdmBtn.style.backgroundColor = "";
        cdmBtn.style.cursor = "pointer";
      }

      clickUpBtn.textContent = "Upgrade Click (" + upgradePrice + " Gold)";
      dupBtn.textContent = "Duplicate Button (" + duplicatePrice + " Gold)";
      autoBtn.textContent = "Buy Auto Clicker (" + autoClickerPrice + " Gold)";
      cdBtn.textContent = (cooldown <= minCooldown) ? "Cooldown MAXED" : "Reduce Cooldown -0.05s (" + cooldownPrice + " Gold)";
    }
