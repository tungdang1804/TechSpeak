
/**
 * Audio Queue Manager
 * Chuyên trách việc điều phối các request API TTS để tránh lỗi 429 (Too Many Requests)
 * và đảm bảo trải nghiệm người dùng mượt mà.
 */

interface AudioTask {
  id: string;
  fn: () => Promise<void>;
  priority: number; 
}

class AudioQueueManager {
  private queue: AudioTask[] = [];
  private activeRequests = 0;
  private maxConcurrent = 4;
  private throttleUntil = 0;
  private minGapMs = 100;

  async push(task: AudioTask) {
    this.queue.push(task);
    this.process();
  }

  private async process() {
    if (this.activeRequests >= this.maxConcurrent || this.queue.length === 0) return;

    // Ưu tiên tác vụ có priority cao (Play vs Preload)
    this.queue.sort((a, b) => b.priority - a.priority);
    const task = this.queue.shift();
    if (!task) return;

    this.activeRequests++;

    const execute = async () => {
      const now = Date.now();
      if (now < this.throttleUntil) {
        await new Promise(r => setTimeout(r, this.throttleUntil - now));
      }

      try {
        await task.fn();
        this.throttleUntil = Date.now() + this.minGapMs;
      } catch (e) {
        console.error("Queue Task Error:", e);
      } finally {
        this.activeRequests--;
        this.process();
      }
    };

    execute();
    if (this.activeRequests < this.maxConcurrent && this.queue.length > 0) {
      this.process();
    }
  }
}

export const audioQueue = new AudioQueueManager();
