import { BaseCallbackHandler } from '@langchain/core/callbacks/base';
import type { Serialized } from '@langchain/core/load/serializable';
import type { BaseMessage } from '@langchain/core/messages';
import type { PinoLogger } from 'nestjs-pino';

const PREVIEW_MAX_LENGTH = 240;

export function createLangchainCallbackHandler(
  logger: PinoLogger,
  threadId: string,
): BaseCallbackHandler {
  return BaseCallbackHandler.fromMethods({
    handleChatModelStart: (
      llm,
      messages,
      runId,
      parentRunId,
      extraParams,
      tags,
      metadata,
      runName,
    ) => {
      logger.info(
        {
          event: 'langchain_chat_model_started',
          threadId,
          runId,
          parentRunId,
          runName,
          modelName: extractModelName(llm, extraParams),
          tags,
          metadata,
          messagePreview: buildMessagesPreview(messages),
        },
        'LangChain chat model started',
      );
    },
    handleLLMEnd: (output, runId, parentRunId, tags, extraParams) => {
      logger.info(
        {
          event: 'langchain_chat_model_finished',
          threadId,
          runId,
          parentRunId,
          tags,
          modelName: extractModelName(undefined, extraParams),
          outputPreview: previewValue(output),
        },
        'LangChain chat model finished',
      );
    },
    handleLLMError: (error, runId, parentRunId, tags, extraParams) => {
      logger.error(
        {
          event: 'langchain_chat_model_failed',
          threadId,
          runId,
          parentRunId,
          tags,
          modelName: extractModelName(undefined, extraParams),
          errorName: extractErrorName(error),
          errorMessage: extractErrorMessage(error),
        },
        'LangChain chat model failed',
      );
    },
    handleChainStart: (
      chain,
      inputs,
      runId,
      runType,
      tags,
      metadata,
      runName,
      parentRunId,
    ) => {
      logger.info(
        {
          event: 'langchain_chain_started',
          threadId,
          runId,
          parentRunId,
          runType,
          runName,
          chainName: extractSerializedName(chain),
          tags,
          metadata,
          inputPreview: previewValue(inputs),
        },
        'LangChain chain started',
      );
    },
    handleChainEnd: (outputs, runId, parentRunId, tags) => {
      logger.info(
        {
          event: 'langchain_chain_finished',
          threadId,
          runId,
          parentRunId,
          tags,
          outputPreview: previewValue(outputs),
        },
        'LangChain chain finished',
      );
    },
    handleChainError: (error, runId, parentRunId, tags, kwargs) => {
      logger.error(
        {
          event: 'langchain_chain_failed',
          threadId,
          runId,
          parentRunId,
          tags,
          inputPreview: previewValue(kwargs?.inputs),
          errorName: extractErrorName(error),
          errorMessage: extractErrorMessage(error),
        },
        'LangChain chain failed',
      );
    },
    handleToolStart: (
      tool,
      input,
      runId,
      parentRunId,
      tags,
      metadata,
      runName,
      toolCallId,
    ) => {
      logger.info(
        {
          event: 'langchain_tool_started',
          threadId,
          runId,
          parentRunId,
          runName,
          toolCallId,
          toolName: extractSerializedName(tool),
          tags,
          metadata,
          inputPreview: previewValue(input),
        },
        'LangChain tool started',
      );
    },
    handleToolEnd: (output, runId, parentRunId, tags) => {
      logger.info(
        {
          event: 'langchain_tool_finished',
          threadId,
          runId,
          parentRunId,
          tags,
          outputPreview: previewValue(output),
        },
        'LangChain tool finished',
      );
    },
    handleToolError: (error, runId, parentRunId, tags) => {
      logger.error(
        {
          event: 'langchain_tool_failed',
          threadId,
          runId,
          parentRunId,
          tags,
          errorName: extractErrorName(error),
          errorMessage: extractErrorMessage(error),
        },
        'LangChain tool failed',
      );
    },
  });
}

export function previewValue(value: unknown) {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value === 'string') {
    return truncate(value);
  }

  try {
    return truncate(JSON.stringify(value));
  } catch {
    return truncate(String(value));
  }
}

function truncate(value: string) {
  if (value.length <= PREVIEW_MAX_LENGTH) {
    return value;
  }

  return `${value.slice(0, PREVIEW_MAX_LENGTH)}...`;
}

function buildMessagesPreview(messages: BaseMessage[][]) {
  const flattenedMessages = messages.flat();
  const messageContents = flattenedMessages
    .map((message) => previewValue(message.content))
    .filter((content): content is string => Boolean(content));

  if (messageContents.length === 0) {
    return undefined;
  }

  return truncate(messageContents.join(' | '));
}

function extractSerializedName(serialized: Serialized | undefined) {
  if (!serialized) {
    return undefined;
  }

  const serializedName = 'name' in serialized ? serialized.name : undefined;

  if (typeof serializedName === 'string' && serializedName.length > 0) {
    return serializedName;
  }

  if ('id' in serialized && Array.isArray(serialized.id)) {
    return serialized.id.join('.');
  }

  return undefined;
}

function extractModelName(
  serialized: Serialized | undefined,
  extraParams?: Record<string, unknown>,
) {
  const modelNameFromParams = typeof extraParams?.ls_model_name === 'string'
    ? extraParams.ls_model_name
    : undefined;

  if (modelNameFromParams) {
    return modelNameFromParams;
  }

  return extractSerializedName(serialized);
}

function extractErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return typeof error === 'string' ? error : previewValue(error);
}

function extractErrorName(error: unknown) {
  if (error instanceof Error) {
    return error.name;
  }

  return undefined;
}
