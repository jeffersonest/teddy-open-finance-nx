export abstract class AgentRunner {
  abstract chat(message: string, threadId: string): Promise<string>;
}
