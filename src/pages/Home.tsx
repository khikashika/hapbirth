import { useMemo, useState } from "react";
import confetti from "canvas-confetti";
import { trpc } from "@/providers/trpc";
import { EVENT } from "@/config";

const neon = (color: string) => ({
  textShadow: `0 0 6px ${color}, 0 0 20px ${color}, 0 0 45px ${color}, 0 0 80px ${color}`,
});

const CONFETTI_COLORS = ["#e879f9", "#22d3ee", "#a3e635", "#facc15", "#ffffff"];

function fireworks() {
  const end = Date.now() + 1800;
  (function frame() {
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.7 },
      colors: CONFETTI_COLORS,
    });
    confetti({
      particleCount: 6,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.7 },
      colors: CONFETTI_COLORS,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
  setTimeout(
    () =>
      confetti({
        particleCount: 160,
        spread: 100,
        origin: { y: 0.6 },
        colors: CONFETTI_COLORS,
        scalar: 1.2,
      }),
    400,
  );
}

// Летящие неоновые частицы
function Particles() {
  const parts = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => {
        const colors = ["#e879f9", "#22d3ee", "#a3e635", "#facc15"];
        const c = colors[i % colors.length];
        const size = 4 + Math.random() * 10;
        return {
          left: `${Math.random() * 100}%`,
          width: size,
          height: size,
          background: c,
          boxShadow: `0 0 ${size * 2}px ${c}`,
          ["--d" as string]: `${9 + Math.random() * 12}s`,
          ["--delay" as string]: `${-Math.random() * 15}s`,
          ["--s" as string]: `${0.6 + Math.random()}`,
          ["--o" as string]: `${0.4 + Math.random() * 0.5}`,
        };
      }),
    [],
  );
  return (
    <>
      {parts.map((p, i) => (
        <div key={i} className="particle" style={p} />
      ))}
    </>
  );
}

// Мерцающие звёзды
function Stars() {
  const stars = useMemo(
    () =>
      Array.from({ length: 40 }, () => {
        const size = 1 + Math.random() * 2.5;
        return {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: size,
          height: size,
          boxShadow: "0 0 6px #fff",
          ["--d" as string]: `${2 + Math.random() * 3}s`,
          ["--delay" as string]: `${-Math.random() * 4}s`,
        };
      }),
    [],
  );
  return (
    <>
      {stars.map((s, i) => (
        <div key={i} className="star" style={s} />
      ))}
    </>
  );
}

// Летящие шарики
function Balloons() {
  const balloons = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => {
        const emojis = ["🎈", "🎉", "🎊", "⭐", "🎈", "✨"];
        return {
          left: `${5 + Math.random() * 90}%`,
          ["--fs" as string]: `${26 + Math.random() * 26}px`,
          ["--d" as string]: `${12 + Math.random() * 10}s`,
          ["--delay" as string]: `${-Math.random() * 18}s`,
          emoji: emojis[i % emojis.length],
        };
      }),
    [],
  );
  return (
    <>
      {balloons.map((b, i) => (
        <div key={i} className="balloon" style={b}>
          {b.emoji}
        </div>
      ))}
    </>
  );
}

// Имя по буквам с эффектом вылёта
function AnimatedLetters({ text, className, style, baseDelay = 0 }: { text: string; className?: string; style?: React.CSSProperties; baseDelay?: number }) {
  return (
    <span className={className} style={style}>
      {text.split("").map((ch, i) => (
        <span key={i} className="letter-pop" style={{ animationDelay: `${baseDelay + i * 0.09}s` }}>
          {ch}
        </span>
      ))}
    </span>
  );
}

export default function Home() {
  const params = new URLSearchParams(window.location.search);
  const adminKey = params.get("admin");
  const [intro, setIntro] = useState(true);

  return (
    <div
      className="min-h-screen text-white overflow-hidden relative"
      style={{ background: "#07070f" }}
    >
      {/* Подвижные неоновые пятна на фоне */}
      <div className="neon-blob" style={{ width: 420, height: 420, top: "-8%", left: "-10%", background: "#7c3aed", opacity: 0.45 }} />
      <div className="neon-blob" style={{ width: 380, height: 380, bottom: "-10%", right: "-8%", background: "#0891b2", opacity: 0.4, animationDelay: "-5s" }} />
      <div className="neon-blob" style={{ width: 260, height: 260, top: "40%", left: "60%", background: "#db2777", opacity: 0.3, animationDelay: "-9s" }} />
      <div className="scanline" />
      <Stars />
      <Particles />
      <Balloons />

      {intro ? (
        <Intro onDone={() => setIntro(false)} />
      ) : (
        <div className="relative z-10">
          {adminKey ? <AdminPage adminKey={adminKey} /> : <InvitePage />}
        </div>
      )}
    </div>
  );
}

// Стартовая заставка
function Intro({ onDone }: { onDone: () => void }) {
  return (
    <button
      onClick={onDone}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07070f] cursor-pointer"
    >
      <div className="intro-flash text-center px-6 relative">
        {/* Вращающееся неоновое кольцо за текстом */}
        <div className="disco-ring" style={{ width: 340, height: 340, top: "50%", left: "50%", marginTop: -170, marginLeft: -170 }} />
        <div className="relative mb-8">
          <div
            className="text-cyan-300 text-6xl sm:text-7xl font-extrabold uppercase"
            style={{
              ...neon("#22d3ee"),
              animation: "neonFlicker 4s infinite, heartbeat 1.8s ease-in-out infinite",
            }}
          >
            Вы
          </div>
          <div
            className="text-cyan-200/90 text-2xl sm:text-3xl font-bold uppercase mt-2"
            style={{
              ...neon("#22d3ee"),
              letterSpacing: "0.35em",
              paddingLeft: "0.35em",
              animation: "neonFlicker 4s infinite 0.3s",
            }}
          >
            приглашены
          </div>
        </div>
        <div className="relative text-5xl sm:text-7xl font-extrabold text-fuchsia-400 neon-flicker" style={neon("#e879f9")}>
          НЕОНОВАЯ
        </div>
        <div className="relative text-5xl sm:text-7xl font-extrabold rainbow-text neon-pulse mt-2">
          ВЕЧЕРИНКА
        </div>
        <div className="relative mt-10 text-white/60 animate-pulse text-lg">нажми, чтобы открыть →</div>
      </div>
    </button>
  );
}

function InvitePage() {
  const [name, setName] = useState("");
  const [parentsOk, setParentsOk] = useState(false);
  const [done, setDone] = useState<null | { already: boolean }>(null);
  const [showModal, setShowModal] = useState(false);

  const guestsQuery = trpc.guests.list.useQuery(undefined, {
    refetchInterval: 15000,
  });
  const join = trpc.guests.join.useMutation({
    onSuccess: (r) => {
      setDone({ already: r.already });
      setShowModal(true);
      fireworks();
      guestsQuery.refetch();
    },
  });

  const guestCount = guestsQuery.data?.length ?? 0;

  return (
    <div className="mx-auto max-w-2xl px-5 py-12 text-center">
      {/* Заголовок */}
      <div className="rise-in mb-2 text-sm tracking-[0.5em] text-cyan-300 uppercase neon-flicker" style={neon("#22d3ee")}>
        {EVENT.title}
      </div>
      <div className="rise-in text-2xl sm:text-3xl font-bold text-white/90" style={{ animationDelay: "0.15s" }}>
        День рождения
      </div>
      <h1 className="mb-1 relative inline-block">
        <div className="disco-ring" style={{ width: 260, height: 260, top: "50%", left: "50%", marginTop: -130, marginLeft: -130 }} />
        <AnimatedLetters
          text="АЛИСЫ"
          baseDelay={0.25}
          className="relative text-7xl sm:text-8xl font-extrabold text-fuchsia-400 neon-pulse"
          style={neon("#e879f9")}
        />
      </h1>
      <div
        className="rise-in text-4xl font-extrabold rainbow-text mb-8 heartbeat"
        style={{ animationDelay: "0.6s" }}
      >
        8 лет! <span className="wiggle">🎉</span>
      </div>

      {/* Дата и программа */}
      <div className="rise-in glow-box rounded-2xl border border-fuchsia-500/40 bg-white/5 p-6 mb-8 backdrop-blur" style={{ animationDelay: "0.45s" }}>
        <div className="text-2xl font-bold mb-1">
          <span className="bounce-soft">📅</span> {EVENT.date} · начало в {EVENT.time}
        </div>
        <div className="text-cyan-200/90 text-lg mb-1">
          <span className="bounce-soft" style={{ animationDelay: "0.4s" }}>📍</span> {EVENT.venue}, {EVENT.address}
        </div>
        <div className="text-cyan-200/90 text-lg mb-3 mt-4">В программе:</div>
        <div className="flex flex-wrap justify-center gap-3">
          {EVENT.program.map((p, i) => (
            <span
              key={p}
              className="rounded-full border border-cyan-400/50 px-4 py-1 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.3)] neon-pulse"
              style={{ animationDelay: `${i * 0.4}s` }}
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* Форма */}
      {!done ? (
        <div className="rise-in glow-box rounded-2xl border border-cyan-400/40 bg-white/5 p-6 mb-8 backdrop-blur" style={{ animationDelay: "0.6s" }}>
          <div className="text-xl font-bold mb-4 text-fuchsia-300 neon-flicker" style={neon("#e879f9")}>
            Придёшь? Подтверди приход ⬇️
          </div>
          <form
            className="flex flex-col gap-3 justify-center max-w-md mx-auto"
            onSubmit={(e) => {
              e.preventDefault();
              if (name.trim()) join.mutate({ name: name.trim() });
            }}
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введи своё имя"
              className="rounded-xl bg-black/50 border border-fuchsia-500/50 px-4 py-3 text-lg outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(34,211,238,0.6)] transition flex-1"
            />
            <label className="flex items-center gap-3 justify-center text-left cursor-pointer select-none rounded-xl border border-white/15 bg-black/30 px-4 py-2 hover:border-cyan-400/50 transition">
              <input
                type="checkbox"
                checked={parentsOk}
                onChange={(e) => setParentsOk(e.target.checked)}
                className="w-5 h-5 accent-fuchsia-500 shrink-0"
              />
              <span className="text-sm text-white/85">
                Мои родители знают и отпустили меня на праздник 💜
              </span>
            </label>
            <button
              type="submit"
              disabled={join.isPending || !name.trim() || !parentsOk}
              className="shine-wrap rounded-xl px-6 py-3 text-lg font-extrabold text-black bg-gradient-to-r from-fuchsia-400 to-cyan-300 hover:scale-110 active:scale-95 transition disabled:opacity-40 shadow-[0_0_25px_rgba(232,121,249,0.7)] neon-pulse"
            >
              {join.isPending ? "..." : "Я приду! 🎈"}
            </button>
          </form>
          {join.isError && (
            <div className="text-red-400 mt-3 text-sm">Что-то пошло не так, попробуй ещё раз</div>
          )}
        </div>
      ) : (
        <div className="success-pop glow-box rounded-2xl border border-green-400/50 bg-white/5 p-6 mb-8 backdrop-blur">
          <div className="text-2xl font-extrabold text-green-300" style={neon("#4ade80")}>
            Ты в списке! 🎉
          </div>
        </div>
      )}

      {/* Выскакивающее окно после записи */}
      {done && showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center px-5 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="success-pop glow-box rounded-3xl border border-green-400/60 bg-[#0b0b18] p-8 max-w-md w-full text-center" onClick={(e) => e.stopPropagation()}>
            <div className="text-6xl mb-4 bounce-soft">🎉</div>
            <div className="text-4xl font-extrabold text-green-300 neon-pulse mb-4" style={neon("#4ade80")}>
              {done.already ? "Ты уже в списке!" : "Ура!"}
            </div>
            <div className="text-xl text-white/90 leading-relaxed">
              Буду ждать тебя{" "}
              <span className="text-fuchsia-300 font-bold">{EVENT.date} в {EVENT.time}</span>
              <br />
              по адресу:{" "}
              <span className="text-cyan-300 font-bold">{EVENT.venue}, {EVENT.address}</span>
            </div>
            <div className="mt-6 text-white/50 text-sm">До встречи на вечеринке! 💜</div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-5 text-cyan-300/70 underline text-sm hover:text-cyan-200"
            >
              посмотреть, кто ещё идёт →
            </button>
          </div>
        </div>
      )}

      {/* Кто уже идёт */}
      <div className="rise-in rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur" style={{ animationDelay: "0.75s" }}>
        <div className="text-lg font-bold mb-3 text-cyan-200">
          Уже идут: <span className="text-fuchsia-300" style={neon("#e879f9")}>{guestCount}</span>
        </div>
        {guestCount === 0 ? (
          <div className="text-white/50">Пока никого — стань первым! 🚀</div>
        ) : (
          <div className="flex flex-wrap justify-center gap-2">
            {guestsQuery.data!.map((g, i) => (
              <span
                key={g.id}
                className="rise-in rounded-full bg-fuchsia-500/15 border border-fuchsia-400/40 px-3 py-1 text-fuchsia-200 shadow-[0_0_10px_rgba(232,121,249,0.25)]"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {g.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminPage({ adminKey }: { adminKey: string }) {
  const listQuery = trpc.guests.adminList.useQuery({ key: adminKey });
  const remove = trpc.guests.remove.useMutation({
    onSuccess: () => listQuery.refetch(),
  });
  const rows = useMemo(() => listQuery.data ?? [], [listQuery.data]);

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <h1 className="text-3xl font-extrabold text-fuchsia-400 mb-2" style={neon("#e879f9")}>
        Админ-панель
      </h1>
      <div className="text-white/60 mb-6">
        День рождения Алисы · {EVENT.date} в {EVENT.time} · {EVENT.venue}
      </div>

      {listQuery.isError ? (
        <div className="rounded-xl border border-red-500/50 bg-red-500/10 p-4 text-red-300">
          Неверный ключ доступа
        </div>
      ) : (
        <>
          <div className="text-xl font-bold text-cyan-300 mb-4">
            Всего записалось: {rows.length}
          </div>
          <div className="space-y-2">
            {rows.map((g, i) => (
              <div
                key={g.id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <div>
                  <span className="text-white/40 mr-3">{i + 1}.</span>
                  <span className="text-lg">{g.name}</span>
                  <span className="text-white/40 text-sm ml-3">
                    {new Date(g.createdAt).toLocaleString("ru-RU")}
                  </span>
                </div>
                <button
                  onClick={() => {
                    if (confirm(`Удалить «${g.name}» из списка?`))
                      remove.mutate({ key: adminKey, id: g.id });
                  }}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  удалить
                </button>
              </div>
            ))}
            {rows.length === 0 && !listQuery.isPending && (
              <div className="text-white/50">Пока никто не записался</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
