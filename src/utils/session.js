// Session Management - Like CSIO Portal

const SESSION_TIMEOUT_MINUTES = 30; // 30 minutes like CSIO portal
const WARNING_MINUTES = 2; // Show warning 2 minutes before timeout

class SessionManager {
  constructor() {
    this.timeoutId = null;
    this.warningId = null;
    this.listeners = [];
    this.isWarningShown = false;
  }

  // Start session timer
  startTimer(onTimeout, onWarning) {
    this.clearTimers();
    
    // Set warning timer (2 minutes before timeout)
    this.warningId = setTimeout(() => {
      this.isWarningShown = true;
      if (onWarning) onWarning();
    }, (SESSION_TIMEOUT_MINUTES - WARNING_MINUTES) * 60 * 1000);
    
    // Set timeout timer
    this.timeoutId = setTimeout(() => {
      this.clearTimers();
      if (onTimeout) onTimeout();
    }, SESSION_TIMEOUT_MINUTES * 60 * 1000);
  }

  // Reset session timer on user activity
  resetTimer(onTimeout, onWarning) {
    this.startTimer(onTimeout, onWarning);
  }

  // Clear all timers
  clearTimers() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    if (this.warningId) {
      clearTimeout(this.warningId);
      this.warningId = null;
    }
    this.isWarningShown = false;
  }

  // Get remaining session time in seconds
  getRemainingTime() {
    // This would need to be implemented with actual expiry tracking
    return SESSION_TIMEOUT_MINUTES * 60;
  }

  // Add event listener for session events
  addListener(callback) {
    this.listeners.push(callback);
  }

  // Notify listeners
  notify(event, data) {
    this.listeners.forEach(listener => listener(event, data));
  }
}

export const sessionManager = new SessionManager();
export { SESSION_TIMEOUT_MINUTES, WARNING_MINUTES };