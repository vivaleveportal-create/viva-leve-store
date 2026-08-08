import Groq from 'groq-sdk'
import type { ChatCompletion } from 'groq-sdk/resources/chat/completions'

export const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// Nenhum nome de modelo fica no codigo: tudo vem do ambiente.
// GROQ_MODEL          -> modelo principal (obrigatorio)
// GROQ_MODEL_FALLBACK -> usado se o principal faltar ou se a chamada falhar (opcional)
const PRIMARY = process.env.GROQ_MODEL?.trim()
const FALLBACK = process.env.GROQ_MODEL_FALLBACK?.trim()

/** Ordem de tentativa, sem duplicatas e sem valores vazios. */
export function getModelChain(): string[] {
  return [...new Set([PRIMARY, FALLBACK].filter(Boolean) as string[])]
}

/** Modelos da familia gpt-oss aceitam reasoning_effort; os demais rejeitam. */
function isReasoningModel(model: string): boolean {
  return model.startsWith('openai/gpt-oss')
}

type ChatMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

type CreateOptions = {
  messages: ChatMessage[]
  maxCompletionTokens: number
  temperature?: number
  /** Prefixo usado nos logs, ex.: 'chat' ou 'whatsapp'. */
  logLabel?: string
}

/**
 * Chama a Groq tentando o modelo principal e, se ele falhar, o de fallback.
 * Lanca erro se nenhum modelo estiver configurado ou se todos falharem.
 */
export async function createChatCompletion({
  messages,
  maxCompletionTokens,
  temperature = 0.7,
  logLabel = 'groq',
}: CreateOptions): Promise<ChatCompletion> {
  const models = getModelChain()

  if (models.length === 0) {
    throw new Error(
      'Nenhum modelo configurado: defina GROQ_MODEL (e opcionalmente GROQ_MODEL_FALLBACK).'
    )
  }

  let lastError: unknown

  for (const model of models) {
    try {
      return await groq.chat.completions.create({
        model,
        messages,
        max_completion_tokens: maxCompletionTokens,
        temperature,
        ...(isReasoningModel(model) ? { reasoning_effort: 'low' as const } : {}),
      })
    } catch (error) {
      lastError = error
      console.error(`[${logLabel}] Falha no modelo "${model}":`, error)
    }
  }

  throw lastError
}
