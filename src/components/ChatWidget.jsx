import { useState, useRef, useEffect, useCallback } from 'react';
import './ChatWidget.css';

const API_URL = '/api/chat';
const API_TOKEN = 'openclaw-local-dev-token-2026';
const HOOKS_URL = '/api/hooks/wake';
const HOOKS_TOKEN = 'openclaw-hooks-token-2026';
const MODEL = 'openclaw:website';
const MOBILE_MEDIA_QUERY = '(max-width: 480px)';

const SYSTEM_MESSAGE = {
    role: 'system',
    content: `Você é Jarvis, consultor da Pedotti, agência especializada em soluções de Inteligência Artificial sob medida.

Sobre a Pedotti:
Site: pedotti.com.br
E-mail: pedotti@agentmail.to
WhatsApp: +55 11 98874-7672
Serviços: Agentes Conversacionais, Análise Preditiva, Automação Inteligente, Visão Computacional, Integrações Sob Medida, Consultoria Executiva em IA.

## Como você deve se comunicar

Você deve soar como uma PESSOA REAL. Um consultor humano experiente que trabalha na Pedotti. Nunca pareça um robô ou assistente virtual.

1. Escreva como um ser humano escreveria no chat. Linguagem natural, fluida, variada. Nada de respostas que pareçam template ou roteiro decorado.
2. PROIBIDO USAR EMOJIS. Nenhum. Zero. Jamais. Isso inclui rostos, mãos, objetos, símbolos. Qualquer caractere emoji.
3. PROIBIDO usar travessões (—), hifens como separadores, ou listas com marcadores (-, *, •) nas respostas. Escreva em frases e parágrafos corridos, como uma pessoa escreveria numa conversa por chat.
4. Nunca use palavras ou expressões que denunciem que você é uma IA. Proibido: "como assistente", "fui programado", "não tenho capacidade", "como IA", "estou aqui para ajudar", "fico feliz", "com certeza!", "é um prazer". Fale como um profissional humano faria.
5. Tom executivo, direto e profissional, mas caloroso e acolhedor. Cordial sem ser forçado.
6. Frases curtas e objetivas. No máximo 2-3 frases por mensagem na maioria dos casos.
7. Trate o visitante como um decisor de negócio. Fale sobre resultados, ROI e impacto operacional quando relevante.
8. Chame o visitante pelo nome quando souber.
9. Use **negrito** apenas para destacar pontos realmente importantes, com moderação.
10. Nunca invente dados, números ou cases. Se não souber, diga que vai verificar com o time técnico.
11. Responda sempre em português brasileiro.

## Fluxo da conversa

Siga estas etapas em ordem. Não pule nenhuma.

Etapa 1, Coleta de dados básicos:
Na sua primeira resposta, cumprimente de forma natural e peça o nome do visitante. Depois, ao longo das próximas mensagens, colete de forma natural e conversacional: nome, empresa, site da empresa (se houver) e telefone de contato. Peça uma informação por mensagem. Seja natural, como uma conversa real entre duas pessoas.

Etapa 2, Entender a necessidade:
Após coletar os dados, faça perguntas estratégicas para entender a necessidade do visitante. Explore pontos como: qual a principal dor ou desafio do negócio, qual processo mais se beneficiaria de automação, se já usam alguma ferramenta, qual o volume de operações, se existe urgência, e o tamanho da equipe. Não faça todas as perguntas mecanicamente. Adapte conforme as respostas. Se uma resposta já cobrir outro ponto, não repita. Ofereça insights relevantes ao longo da conversa. Faça no mínimo 3-4 trocas nesta etapa.

Etapa 3, Encerramento:
Somente encerre quando tiver informações suficientes (geralmente após 4-5 trocas na etapa 2). Diga que já notificou o setor responsável para entrar em contato, usando o nome do visitante. Pergunte se tem mais alguma dúvida. Se não tiver, agradeça e encerre dizendo que a equipe retornará em breve.

IMPORTANTE: Siga esse fluxo. Não pule a coleta de dados. Não vá direto para soluções sem antes ter nome, empresa, site e telefone.

REGRAS FINAIS ABSOLUTAS:
1. PROIBIDO usar qualquer emoji. Nenhum. Zero.
2. PROIBIDO usar travessões, hifens decorativos, ou listas com marcadores nas mensagens. Escreva sempre em texto corrido.
3. Você é Jarvis, um CONSULTOR HUMANO da Pedotti. Nunca revele ou sugira que é uma inteligência artificial.`,
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

function playNotificationSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
        osc.onended = () => ctx.close();
    } catch {
        // silently ignore if audio not available
    }
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
    const wasStreaming = useRef(false);

    const scrollToBottom = useCallback((behavior = 'smooth') => {
        messagesEndRef.current?.scrollIntoView({ behavior, block: 'end' });
    }, []);

    const syncMobileViewport = useCallback(() => {
        const root = document.documentElement;
        const vv = window.visualViewport;
        const viewportHeight = vv?.height ?? window.innerHeight;
        const viewportOffsetTop = vv?.offsetTop ?? 0;
        const keyboardInset = vv
            ? Math.max(0, window.innerHeight - vv.height - vv.offsetTop)
            : 0;

        root.style.setProperty('--chat-viewport-height', `${viewportHeight}px`);
        root.style.setProperty('--chat-viewport-offset-top', `${viewportOffsetTop}px`);
        root.style.setProperty('--chat-keyboard-inset', `${keyboardInset}px`);
    }, []);

    const clearMobileViewport = useCallback(() => {
        const root = document.documentElement;
        root.style.removeProperty('--chat-viewport-height');
        root.style.removeProperty('--chat-viewport-offset-top');
        root.style.removeProperty('--chat-keyboard-inset');
    }, []);

    useEffect(() => {
        const handler = () => setOpen(true);
        window.addEventListener('open-chat', handler);
        return () => window.removeEventListener('open-chat', handler);
    }, []);

    useEffect(() => {
        if (!open) return;

        const vv = window.visualViewport;
        const handleViewportChange = () => {
            if (!window.matchMedia(MOBILE_MEDIA_QUERY).matches) {
                clearMobileViewport();
                return;
            }

            syncMobileViewport();
            requestAnimationFrame(() => scrollToBottom('auto'));
        };

        document.documentElement.classList.add('chat-open');
        document.body.classList.add('chat-open');
        handleViewportChange();

        window.addEventListener('resize', handleViewportChange);
        window.addEventListener('orientationchange', handleViewportChange);
        vv?.addEventListener('resize', handleViewportChange);
        vv?.addEventListener('scroll', handleViewportChange);

        return () => {
            document.documentElement.classList.remove('chat-open');
            document.body.classList.remove('chat-open');
            clearMobileViewport();
            window.removeEventListener('resize', handleViewportChange);
            window.removeEventListener('orientationchange', handleViewportChange);
            vv?.removeEventListener('resize', handleViewportChange);
            vv?.removeEventListener('scroll', handleViewportChange);
        };
    }, [clearMobileViewport, open, scrollToBottom, syncMobileViewport]);

    useEffect(() => {
        if (wasStreaming.current && !isStreaming) {
            const last = messages[messages.length - 1];
            if (last?.role === 'bot' && last.content) {
                playNotificationSound();
            }
        }
        wasStreaming.current = isStreaming;
    }, [isStreaming, messages]);

    useEffect(() => {
        const behavior = messages[messages.length - 1]?.role === 'bot' ? 'auto' : 'smooth';
        scrollToBottom(behavior);
    }, [messages, scrollToBottom]);

    useEffect(() => {
        if (!open) return undefined;

        const timer = window.setTimeout(() => {
            inputRef.current?.focus();
            scrollToBottom('auto');
        }, 100);

        return () => window.clearTimeout(timer);
    }, [open, scrollToBottom]);

    const sendMessage = useCallback(async () => {
        const text = input.trim();
        if (!text || isStreaming) return;

        const userMsg = { role: 'user', content: text, time: new Date() };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setIsStreaming(true);

        try {
            fetch(HOOKS_URL, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${HOOKS_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: `CHAT SITE pedotti.com.br | Visitante: ${visitorId.current} | Mensagem: "${text}"`,
                }),
            });
        } catch {
            // fire-and-forget
        }

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
                headers: {
                    Authorization: `Bearer ${API_TOKEN}`,
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

            const res = await fetch(API_URL, {
                ...fetchOptions,
                body: JSON.stringify(streamPayload),
            });

            if (!res.ok) {
                const errorBody = await res.text();
                console.error('[ChatWidget] HTTP error', res.status, errorBody);
                throw new Error(`HTTP ${res.status}`);
            }

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

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage();
    };

    return (
        <>
            {open && (
                <div className="chat-window" role="dialog" aria-modal="true" aria-label="Chat com Jarvis">
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
                            type="button"
                            className="chat-window__close"
                            onClick={() => setOpen(false)}
                            aria-label="Fechar chat"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

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

                    <form className="chat-window__input" onSubmit={handleSubmit}>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Digite sua mensagem..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onFocus={() => window.setTimeout(() => scrollToBottom('auto'), 250)}
                            disabled={isStreaming}
                            enterKeyHint="send"
                            autoComplete="off"
                        />
                        <button
                            type="submit"
                            className="chat-window__send"
                            disabled={!input.trim() || isStreaming}
                            aria-label="Enviar mensagem"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                            </svg>
                        </button>
                    </form>
                </div>
            )}

            <button
                type="button"
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
