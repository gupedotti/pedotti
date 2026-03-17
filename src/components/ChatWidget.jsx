import { useState, useRef, useEffect, useCallback } from 'react';
import './ChatWidget.css';

const API_URL = import.meta.env.DEV
    ? '/api/chat'
    : 'https://chat.pedotti.com.br/v1/chat/completions';
const API_TOKEN = 'openclaw-local-dev-token-2026';
const HOOKS_URL = import.meta.env.DEV
    ? '/api/hooks/wake'
    : 'https://chat.pedotti.com.br/hooks/wake';
const HOOKS_TOKEN = 'openclaw-hooks-token-2026';
const MODEL = 'openclaw:main';

const SYSTEM_MESSAGE = {
    role: 'system',
    content: `Você é Jarvis, assistente virtual da Pedotti — agência especializada em soluções de Inteligência Artificial sob medida.

## Sobre a Pedotti
- Site: pedotti.com.br
- E-mail: pedotti@agentmail.to
- WhatsApp: +55 11 98874-7672
- Serviços: Agentes Conversacionais, Análise Preditiva, Automação Inteligente, Visão Computacional, Integrações Sob Medida, Consultoria Executiva em IA.

## Tom e estilo
- Tom executivo, direto e profissional. NUNCA use emojis em nenhuma circunstância. Sem informalidade excessiva.
- Frases curtas e objetivas. Vá direto ao ponto.
- Trate o visitante como um decisor de negócio. Fale sobre resultados, ROI e impacto operacional.
- Chame o visitante pelo nome quando souber.
- Use **negrito** para destacar pontos-chave e listas com marcadores quando listar itens.
- Nunca invente dados, números ou cases. Se não souber, diga que vai conectar com o time técnico.
- Responda sempre em português brasileiro.
- Mantenha respostas concisas — no máximo 3-4 frases por mensagem, a menos que o visitante peça detalhamento.

## Fluxo obrigatório de conversa
Siga estas etapas em ordem. Não pule nenhuma etapa.

**Etapa 1 — Coleta de dados básicos:**
Na sua primeira mensagem, apresente-se e peça o nome do visitante.
Depois, ao longo das próximas mensagens, colete de forma natural e conversacional:
- Nome (primeira pergunta)
- Empresa
- Site da empresa (se houver)
- Telefone de contato

Peça uma informação por mensagem. Não peça tudo de uma vez. Seja natural, como uma conversa real.

**Etapa 2 — Entender a necessidade (aprofundar antes de encerrar):**
Após coletar os dados, faça perguntas estratégicas para entender a fundo a necessidade do visitante. Explore os seguintes pontos, um por mensagem, de forma natural e conversacional:
- Qual é a principal dor ou desafio do negócio hoje?
- Qual processo ou área da empresa mais se beneficiaria de automação ou IA?
- Já utilizam alguma ferramenta ou solução de IA atualmente? Se sim, qual?
- Qual o volume aproximado de operações/atendimentos/dados envolvidos?
- Existe algum prazo ou urgência para implementar uma solução?
- Qual o tamanho aproximado da equipe envolvida?

Não faça todas as perguntas mecanicamente — adapte conforme as respostas do visitante. Se uma resposta já cobrir outro ponto, não repita. O objetivo é ter contexto suficiente para que o time comercial da Pedotti entre em contato já preparado. Ofereça insights relevantes ao longo da conversa. Faça no mínimo 3-4 trocas nesta etapa antes de considerar encerrar.

**Etapa 3 — Encerramento:**
Somente encerre quando tiver informações suficientes sobre a necessidade, o cenário atual e a expectativa do visitante (geralmente após 4-5 trocas na etapa 2). Diga exatamente:
"Obrigado pelas informações, [nome]. Já notificamos o setor responsável para entrar em contato com você."
Em seguida, pergunte: "Mais alguma dúvida?"
- Se o visitante disser que não tem mais dúvidas → agradeça e encerre com "Obrigado pelo contato. A equipe da Pedotti retornará em breve."
- Se tiver outra dúvida → responda ou colete a dúvida, diga que encaminhou para os responsáveis, e pergunte novamente "Mais alguma dúvida?"

IMPORTANTE: Você DEVE seguir esse fluxo. Não pule a coleta de dados. Não vá direto para soluções sem antes ter nome, empresa, site e telefone.`,
};

const WELCOME_MESSAGE = {
    role: 'bot',
    content: 'Olá! Tudo bem? Para direcionar melhor a conversa inicial, qual é o seu nome?',
    time: new Date(),
};

function getVisitorId() {
    let id = localStorage.getItem('pedotti_visitor_id');
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem('pedotti_visitor_id', id);
    }
    return id;
}

function formatTime(date) {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function renderMarkdown(text) {
    if (!text) return null;

    const lines = text.split('\n');
    const elements = [];
    let listItems = [];

    const flushList = () => {
        if (listItems.length > 0) {
            elements.push(
                <ul key={`ul-${elements.length}`} className="chat-msg__list">
                    {listItems.map((item, j) => (
                        <li key={j}>{formatInline(item)}</li>
                    ))}
                </ul>
            );
            listItems = [];
        }
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (!line) {
            flushList();
            continue;
        }

        const listMatch = line.match(/^(?:[-*•]|\d+\.)\s+(.+)/);
        if (listMatch) {
            listItems.push(listMatch[1]);
            continue;
        }

        flushList();
        elements.push(
            <p key={`p-${i}`} className="chat-msg__paragraph">
                {formatInline(line)}
            </p>
        );
    }
    flushList();

    return elements;
}

function formatInline(text) {
    const parts = text.split(/(\*\*[^*]+\*\*|__[^_]+__)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('__') && part.endsWith('__')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return part;
    });
}

const ChatWidget = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([WELCOME_MESSAGE]);
    const [input, setInput] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const abortRef = useRef(null);
    const visitorId = useRef(getVisitorId());

    // Listen for custom event from CTA buttons
    useEffect(() => {
        const handler = () => setOpen(true);
        window.addEventListener('open-chat', handler);
        return () => window.removeEventListener('open-chat', handler);
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input when opened
    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [open]);

    const sendMessage = useCallback(async () => {
        const text = input.trim();
        if (!text || isStreaming) return;

        const userMsg = { role: 'user', content: text, time: new Date() };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setIsStreaming(true);

        // Notificação de nova mensagem do visitante (fire-and-forget)
        try {
            fetch(HOOKS_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${HOOKS_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: `CHAT SITE pedotti.com.br | Visitante: ${visitorId.current} | Mensagem: "${text}"`,
                }),
            });
        } catch { /* silencioso */ }

        // Build conversation history for API with system prompt
        const apiMessages = [SYSTEM_MESSAGE];
        for (const m of messages) {
            if (m.role === 'user' || m.role === 'bot') {
                apiMessages.push({
                    role: m.role === 'bot' ? 'assistant' : 'user',
                    content: m.content,
                });
            }
        }
        apiMessages.push({ role: 'user', content: text });

        const botMsg = { role: 'bot', content: '', time: new Date() };
        setMessages((prev) => [...prev, botMsg]);

        const controller = new AbortController();
        abortRef.current = controller;

        try {
            const fetchOptions = {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Authorization': `Bearer ${API_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                signal: controller.signal,
            };

            const streamPayload = {
                model: MODEL,
                messages: apiMessages,
                stream: true,
                user: visitorId.current,
            };

            let res = await fetch(API_URL, {
                ...fetchOptions,
                body: JSON.stringify(streamPayload),
            });

            if (!res.ok) {
                const errorBody = await res.text();
                console.error('[ChatWidget] HTTP error', res.status, errorBody);
                throw new Error(`HTTP ${res.status}`);
            }

            // SSE streaming path
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed.startsWith('data:')) continue;

                    const data = trimmed.slice(5).trim();
                    if (data === '[DONE]') break;

                    try {
                        const parsed = JSON.parse(data);
                        const delta = parsed.choices?.[0]?.delta?.content;
                        if (delta) {
                            setMessages((prev) => {
                                const updated = [...prev];
                                const last = updated[updated.length - 1];
                                updated[updated.length - 1] = { ...last, content: last.content + delta };
                                return updated;
                            });
                        }
                    } catch {
                        // skip malformed chunks
                    }
                }
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                setMessages((prev) => {
                    const updated = [...prev];
                    const last = updated[updated.length - 1];
                    updated[updated.length - 1] = {
                        ...last,
                        content: 'Desculpe, não consegui responder agora. Tente novamente em instantes.',
                    };
                    return updated;
                });
            }
        } finally {
            setIsStreaming(false);
            abortRef.current = null;
        }
    }, [input, isStreaming, messages]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* Chat window */}
            {open && (
                <div className="chat-window" role="dialog" aria-label="Chat com Jarvis">
                    {/* Header */}
                    <div className="chat-window__header">
                        <div className="chat-window__avatar">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4zM20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            </svg>
                        </div>
                        <div className="chat-window__info">
                            <div className="chat-window__name">Jarvis</div>
                            <div className="chat-window__status">Assistente Pedotti</div>
                        </div>
                        <button
                            className="chat-window__close"
                            onClick={() => setOpen(false)}
                            aria-label="Fechar chat"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="chat-window__messages">
                        {messages.map((msg, i) => (
                            <div key={i} className={`chat-msg chat-msg--${msg.role}`}>
                                <div className="chat-msg__content">
                                    {msg.role === 'bot' ? renderMarkdown(msg.content) : msg.content}
                                </div>
                                <span className="chat-msg__time">{formatTime(msg.time)}</span>
                            </div>
                        ))}
                        {isStreaming && messages[messages.length - 1]?.content === '' && (
                            <div className="chat-typing">
                                <span className="chat-typing__dot" />
                                <span className="chat-typing__dot" />
                                <span className="chat-typing__dot" />
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="chat-window__input">
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Digite sua mensagem..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isStreaming}
                        />
                        <button
                            className="chat-window__send"
                            onClick={sendMessage}
                            disabled={!input.trim() || isStreaming}
                            aria-label="Enviar mensagem"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* FAB button */}
            <button
                className={`chat-fab ${open ? 'chat-fab--open' : ''}`}
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? 'Fechar chat' : 'Abrir chat'}
            >
                {open ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                )}
            </button>
        </>
    );
};

export default ChatWidget;
