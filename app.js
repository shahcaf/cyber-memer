/**
 * CYBER MEMBERS — Interactive Engine & Bot Terminal Simulator
 * High-Velocity Discord Infrastructure Showcase
 */

// Tier Configuration Mapped to Bot Runtime
const ROLE_TIERS = {
  member: { name: 'Member', quota: 5, color: '#94a3b8', badge: 'MEMBER' },
  bronze: { name: 'Bronze', quota: 7, color: '#f59e0b', badge: 'BRONZE' },
  silver: { name: 'Silver', quota: 10, color: '#cbd5e1', badge: 'SILVER' },
  gold: { name: 'Gold', quota: 12, color: '#facc15', badge: 'GOLD' },
  booster: { name: 'Booster', quota: 15, color: '#818cf8', badge: 'BOOSTER' },
  premium: { name: 'Premium', quota: 20, color: '#c084fc', badge: 'PREMIUM' },
  diamond: { name: 'Diamond', quota: 30, color: '#22d3ee', badge: 'DIAMOND' },
  emerald: { name: 'Emerald', quota: 40, color: '#34d399', badge: 'EMERALD' }
};

let currentTierKey = 'premium';
let soundEnabled = true;
let isSimulating = false;

// Audio Synthesizer using Web Audio API
class CyberAudio {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  playTone(freq, type = 'sine', duration = 0.08, gainVal = 0.06) {
    if (!soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio fallback silent
    }
  }

  click() {
    this.playTone(850, 'triangle', 0.04, 0.04);
  }

  beep() {
    this.playTone(1200, 'sine', 0.08, 0.05);
  }

  step() {
    this.playTone(600, 'square', 0.03, 0.02);
  }

  success() {
    if (!soundEnabled) return;
    this.playTone(880, 'sine', 0.1, 0.07);
    setTimeout(() => this.playTone(1320, 'sine', 0.18, 0.08), 90);
  }
}

const audio = new CyberAudio();

// DOM Content Loaded Handler
document.addEventListener('DOMContentLoaded', () => {
  setupNavbar();
  setupHeroParallax();
  setupTierSelector();
  setupSimulator();
  setupCopyInvite();
  setupSoundToggle();
});

// Setup sticky navbar effects & mobile menu
function setupNavbar() {
  const header = document.getElementById('header');
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const nav = document.getElementById('main-nav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  if (mobileBtn && nav) {
    mobileBtn.addEventListener('click', () => {
      nav.classList.toggle('mobile-open');
      audio.click();
    });

    nav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('mobile-open');
      });
    });
  }
}

// Parallax Tilt on Hero Card
function setupHeroParallax() {
  const card = document.getElementById('hero-visual');
  if (!card) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = (y / (rect.height / 2)) * -6;
    const rotateY = (x / (rect.width / 2)) * 6;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  });
}

// Tier Selector in Simulator Panel
function setupTierSelector() {
  const pills = document.querySelectorAll('.sim-pill');
  const slider = document.getElementById('member-count-slider');
  const sliderDisplay = document.getElementById('slider-display-val');
  const maxLimitDisplay = document.getElementById('tier-max-limit');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const tierKey = pill.getAttribute('data-tier-val');
      currentTierKey = tierKey;
      const tierData = ROLE_TIERS[tierKey];

      slider.max = tierData.quota;
      slider.value = tierData.quota;
      sliderDisplay.textContent = `${tierData.quota} Members`;
      maxLimitDisplay.textContent = `Max for Tier: ${tierData.quota}`;

      audio.click();
    });
  });

  slider.addEventListener('input', () => {
    sliderDisplay.textContent = `${slider.value} Members`;
  });

  const defaultGuildBtn = document.getElementById('use-default-guild-btn');
  const guildInput = document.getElementById('target-server-input');
  if (defaultGuildBtn && guildInput) {
    defaultGuildBtn.addEventListener('click', () => {
      guildInput.value = '1560942690961723412';
      audio.click();
      showToast('Set to Cyber Members server ID');
    });
  }
}

// Main Simulator & Terminal Execution
function setupSimulator() {
  const runBtn = document.getElementById('run-simulation-btn');
  const resetBtn = document.getElementById('reset-sim-btn');
  const termOutput = document.getElementById('terminal-output');
  const termForm = document.getElementById('term-input-form');
  const termInput = document.getElementById('term-cmd-input');
  const quickChips = document.querySelectorAll('.chip-cmd');

  runBtn.addEventListener('click', () => {
    if (isSimulating) return;
    const guildId = document.getElementById('target-server-input').value.trim() || '1560942690961723412';
    const batchSize = parseInt(document.getElementById('member-count-slider').value, 10);
    executeJoinSimulation(guildId, batchSize);
  });

  resetBtn.addEventListener('click', () => {
    termOutput.innerHTML = `
      <div class="terminal-line text-muted">[SYSTEM] Console buffer cleared</div>
      <div class="terminal-line">Ready for next command sequence.</div>
    `;
    audio.click();
  });

  termForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const cmd = termInput.value.trim();
    if (!cmd) return;
    termInput.value = '';
    handleUserCommand(cmd);
  });

  quickChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      handleUserCommand(cmd);
    });
  });
}

// Process Command from Input or Quick Chips
function handleUserCommand(cmd) {
  audio.click();
  appendTerminalLine(`user@cybermembers:~$ ${cmd}`, 'text-cyan');

  const lower = cmd.toLowerCase().trim();

  if (lower.startsWith('!djoin')) {
    const parts = lower.split(' ');
    const guild = parts[1] || '1560942690961723412';
    const tierData = ROLE_TIERS[currentTierKey];
    executeJoinSimulation(guild, tierData.quota);
  } else if (lower === '!profile' || lower === '!me' || lower === '!tier' || lower === '!myquota') {
    simulateProfileCommand();
  } else if (lower === '!stock' || lower === '!check_tokens') {
    simulateStockCommand();
  } else if (lower === '!get_token') {
    simulateGetTokenCommand();
  } else if (lower === '!help') {
    simulateHelpCommand();
  } else if (lower === '!servers') {
    simulateServersCommand();
  } else if (lower.startsWith('!auth')) {
    appendTerminalLine(`[AUTH] Verifying Discord OAuth grant callback...`, 'text-muted');
    setTimeout(() => {
      appendTerminalLine(`✅ Token registered into pool successfully! New capacity: 841 active tokens.`, 'text-success');
      audio.success();
    }, 600);
  } else {
    appendTerminalLine(`❌ Command not found: "${cmd}". Use !help to inspect available commands.`, 'text-muted');
  }
}

// Live Injection Simulation Workflow
function executeJoinSimulation(guildId, count) {
  isSimulating = true;
  const runBtn = document.getElementById('run-simulation-btn');
  runBtn.disabled = true;
  runBtn.innerHTML = `
    <span class="hud-dot" style="display:inline-block; margin-right:8px;"></span>
    <span>Injecting ${count} Members...</span>
  `;

  appendTerminalLine(`user@cybermembers:~$ !djoin ${guildId}`, 'text-cyan');
  appendTerminalLine(`[1/4] Querying Discord Gateway for Guild ID: ${guildId}...`, 'text-muted');
  audio.step();

  setTimeout(() => {
    const tier = ROLE_TIERS[currentTierKey];
    appendTerminalLine(`[2/4] Authenticated user role: [${tier.badge}] (Max Quota: ${tier.quota})`, 'text-main');
    appendTerminalLine(`[3/4] Preparing dispatch of ${count} token entities with anti-flood pacing...`, 'text-muted');
    
    // Create live progress line
    const progressLine = document.createElement('div');
    progressLine.className = 'terminal-line term-progress';
    document.getElementById('terminal-output').appendChild(progressLine);

    let progress = 0;
    const totalSteps = 10;
    const intervalTime = Math.max(140, 2200 / totalSteps);

    const interval = setInterval(() => {
      progress++;
      const percent = Math.min(100, Math.round((progress / totalSteps) * 100));
      const currentCount = Math.round((percent / 100) * count);
      
      const filledBars = Math.round((percent / 100) * 12);
      const emptyBars = 12 - filledBars;
      const barStr = '▰'.repeat(filledBars) + '▱'.repeat(emptyBars);

      progressLine.innerHTML = `> Ingesting: [${barStr}] <strong>${percent}%</strong> (${currentCount}/${count} members joined)`;
      audio.step();
      scrollTerminalToBottom();

      if (progress >= totalSteps) {
        clearInterval(interval);
        setTimeout(() => {
          renderJoinCompletionEmbed(guildId, count, tier);
          isSimulating = false;
          runBtn.disabled = false;
          runBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            <span>Execute !djoin Simulation</span>
          `;
          audio.success();
          showToast(`Successfully simulated ${count} member joins!`);
        }, 300);
      }
    }, intervalTime);

  }, 600);
}

// Render Discord Embed Output in Terminal
function renderJoinCompletionEmbed(guildId, count, tier) {
  const termOutput = document.getElementById('terminal-output');
  const embedDiv = document.createElement('div');
  embedDiv.className = 'term-embed embed-success';

  embedDiv.innerHTML = `
    <div class="embed-title">🚀 DISCORD MEMBER INJECTION COMPLETE</div>
    <div class="embed-field"><span class="embed-field-name">Target Guild:</span> <span class="embed-field-val"><code>${guildId}</code></span></div>
    <div class="embed-field"><span class="embed-field-name">Members Injected:</span> <span class="embed-field-val"><strong>${count} Accounts</strong></span></div>
    <div class="embed-field"><span class="embed-field-name">Tier Role:</span> <span class="embed-field-val" style="color: ${tier.color}; font-weight:700;">${tier.name}</span></div>
    <div class="embed-field"><span class="embed-field-name">Rate Pacing:</span> <span class="embed-field-val">1.25s per join (Zero Rate Limit Clamps)</span></div>
    <div class="embed-field"><span class="embed-field-name">Status:</span> <span class="embed-field-val text-success">✅ 100% Successful · Verified OAuth2 Ingestion</span></div>
    <div class="embed-footer">Cyber Members REST Gateway · discord.gg/VX4APpF</div>
  `;

  termOutput.appendChild(embedDiv);
  scrollTerminalToBottom();
}

function simulateProfileCommand() {
  const tier = ROLE_TIERS[currentTierKey];
  const termOutput = document.getElementById('terminal-output');
  const embedDiv = document.createElement('div');
  embedDiv.className = 'term-embed embed-purple';

  embedDiv.innerHTML = `
    <div class="embed-title">👤 USER PROFILE &amp; QUOTA AUDIT</div>
    <div class="embed-field"><span class="embed-field-name">Discord Account:</span> <span class="embed-field-val">Visitor#2026</span></div>
    <div class="embed-field"><span class="embed-field-name">Authentication:</span> <span class="embed-field-val text-success">✅ Authenticated &amp; Ready</span></div>
    <div class="embed-field"><span class="embed-field-name">Detected Role:</span> <span class="embed-field-val" style="color: ${tier.color}; font-weight:700;">${tier.name}</span></div>
    <div class="embed-field"><span class="embed-field-name">Max Allowance:</span> <span class="embed-field-val"><strong>${tier.quota} Members</strong> per !djoin cycle</span></div>
    <div class="embed-footer">Upgrade tier on discord.gg/VX4APpF to unlock higher quotas.</div>
  `;

  termOutput.appendChild(embedDiv);
  scrollTerminalToBottom();
}

function simulateStockCommand() {
  const termOutput = document.getElementById('terminal-output');
  const embedDiv = document.createElement('div');
  embedDiv.className = 'term-embed';

  embedDiv.innerHTML = `
    <div class="embed-title">📦 TOKEN DATABASE CAPACITY REPORT</div>
    <div class="embed-field"><span class="embed-field-name">Active Verified Tokens:</span> <span class="embed-field-val"><strong>842 Accounts</strong></span></div>
    <div class="embed-field"><span class="embed-field-name">Refresh Tokens Synced:</span> <span class="embed-field-val">100% Validated</span></div>
    <div class="embed-field"><span class="embed-field-name">Dead Accounts Purged:</span> <span class="embed-field-val">0 (Clean list)</span></div>
    <div class="embed-field"><span class="embed-field-name">Network Stock:</span> <span class="embed-field-val text-cyan">HIGH AVAILABILITY</span></div>
    <div class="embed-footer">Cyber Members Automated Token Clean Engine</div>
  `;

  termOutput.appendChild(embedDiv);
  scrollTerminalToBottom();
}

function simulateGetTokenCommand() {
  const termOutput = document.getElementById('terminal-output');
  const embedDiv = document.createElement('div');
  embedDiv.className = 'term-embed';

  embedDiv.innerHTML = `
    <div class="embed-title">🔐 OAUTH2 VERIFICATION PORTAL</div>
    <div class="embed-field">Click below to authorize your account into the Cyber Members network pool:</div>
    <div class="embed-field"><a href="https://discord.gg/VX4APpF" target="_blank" style="color:#00f0ff; text-decoration:underline;">[ 👉 Click to Authenticate via OAuth2 ]</a></div>
    <div class="embed-footer">Tokens automatically refreshed &amp; maintained securely.</div>
  `;

  termOutput.appendChild(embedDiv);
  scrollTerminalToBottom();
}

function simulateHelpCommand() {
  const termOutput = document.getElementById('terminal-output');
  const embedDiv = document.createElement('div');
  embedDiv.className = 'term-embed';

  embedDiv.innerHTML = `
    <div class="embed-title">🤖 BOT COMMANDS — COMPLETE LIST</div>
    <div class="embed-field"><strong>!djoin &lt;server_id&gt;</strong> — Add member quota to target guild</div>
    <div class="embed-field"><strong>!profile</strong> — Check authentication status &amp; role allowance</div>
    <div class="embed-field"><strong>!stock</strong> — Query available token pool count</div>
    <div class="embed-field"><strong>!get_token</strong> — Get official OAuth2 authentication link</div>
    <div class="embed-field"><strong>!servers</strong> — View connected server registry</div>
    <div class="embed-footer">All commands work via Discord slash commands too!</div>
  `;

  termOutput.appendChild(embedDiv);
  scrollTerminalToBottom();
}

function simulateServersCommand() {
  const termOutput = document.getElementById('terminal-output');
  const embedDiv = document.createElement('div');
  embedDiv.className = 'term-embed';

  embedDiv.innerHTML = `
    <div class="embed-title">🏠 CONNECTED GUILD REGISTRY (Page 1/4)</div>
    <div class="embed-field">⭐ <strong>Cyber Members</strong> (<code>1560942690961723412</code>) — Official Hub</div>
    <div class="embed-field">• <strong>Cyber Community Node 01</strong> (<code>1550239919660728442</code>) — Active</div>
    <div class="embed-field">• <strong>Gaming Arena Alpha</strong> (<code>1474265556176601140</code>) — Ingested</div>
    <div class="embed-footer">Total servers connected: 18 guilds across cluster</div>
  `;

  termOutput.appendChild(embedDiv);
  scrollTerminalToBottom();
}

function appendTerminalLine(text, cssClass = '') {
  const termOutput = document.getElementById('terminal-output');
  const line = document.createElement('div');
  line.className = `terminal-line ${cssClass}`;
  line.textContent = text;
  termOutput.appendChild(line);
  scrollTerminalToBottom();
}

function scrollTerminalToBottom() {
  const termOutput = document.getElementById('terminal-output');
  termOutput.scrollTop = termOutput.scrollHeight;
}

// 1-Click Copy Invite Link
function setupCopyInvite() {
  const copyBtn = document.getElementById('copy-invite-btn');
  const label = document.getElementById('copy-btn-label');
  const inviteCode = document.getElementById('invite-code-text');

  if (copyBtn && inviteCode) {
    copyBtn.addEventListener('click', () => {
      const textToCopy = inviteCode.textContent.trim();
      navigator.clipboard.writeText(textToCopy).then(() => {
        audio.success();
        label.textContent = 'Copied!';
        copyBtn.style.borderColor = 'var(--cyber-cyan)';
        showToast('Copied invite link: discord.gg/VX4APpF');

        setTimeout(() => {
          label.textContent = 'Copy';
          copyBtn.style.borderColor = '';
        }, 2500);
      }).catch(() => {
        showToast('Link: discord.gg/VX4APpF');
      });
    });
  }
}

// Sound Effects Toggle
function setupSoundToggle() {
  const btn = document.getElementById('sound-toggle-btn');
  if (!btn) return;

  const iconOn = btn.querySelector('.sound-on');
  const iconOff = btn.querySelector('.sound-off');

  btn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
      iconOn.classList.remove('hidden');
      iconOff.classList.add('hidden');
      audio.init();
      audio.click();
      showToast('Cyber SFX enabled');
    } else {
      iconOn.classList.add('hidden');
      iconOff.classList.remove('hidden');
      showToast('Sound disabled');
    }
  });
}

// Toast Notification Manager
let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = msg;
  toast.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}
