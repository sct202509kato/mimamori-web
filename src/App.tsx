import { useState, useEffect } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { auth } from "./firebase";

const API_BASE = import.meta.env.VITE_API_BASE as string;

if (!API_BASE) {
    throw new Error("VITE_API_BASE is not set. Check .env.local or Vercel env vars.");
}

const STATUS_URL = `${API_BASE}/status`;
const CHECKIN_URL = `${API_BASE}/checkin`;

export default function App() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // msg -> notice（本番向け）
    const [notice, setNotice] = useState<{ type: "info" | "error"; text: string } | null>(null);

    const [checked, setChecked] = useState<boolean | null>(null);
    const [checkedAt, setCheckedAt] = useState<string | null>(null);

    const user = auth.currentUser;

    async function signup() {
        try {
            setNotice(null);
            await createUserWithEmailAndPassword(auth, email, password);
            setNotice({ type: "info", text: "新規登録できました" });
        } catch (e: any) {
            setNotice({ type: "error", text: e?.message ?? "新規登録に失敗しました" });
        }
    }

    async function login() {
        try {
            setNotice(null);
            await signInWithEmailAndPassword(auth, email, password);
            setNotice({ type: "info", text: "ログインできました" });
        } catch (e: any) {
            setNotice({ type: "error", text: e?.message ?? "ログインに失敗しました" });
        }
    }

    async function logout() {
        await signOut(auth);
        setNotice({ type: "info", text: "ログアウトしました" });
        setChecked(null);
        setCheckedAt(null);
    }

    async function checkin() {
        setNotice(null);
        const token = await auth.currentUser?.getIdToken();
        if (!token) {
            setNotice({ type: "error", text: "先にログインしてください" });
            return;
        }

        try {
            const res = await fetch(CHECKIN_URL, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            const json = await res.json();

            if (!res.ok || json?.ok === false) {
                setNotice({ type: "error", text: json?.error ?? "記録に失敗しました" });
                return;
            }

            setNotice({ type: "info", text: "✅ 記録しました" });
            await getStatus(); // 状態を即反映
        } catch (e: any) {
            setNotice({ type: "error", text: e?.message ?? "記録に失敗しました" });
        }
    }

    async function getStatus() {
        const token = await auth.currentUser?.getIdToken();
        if (!token) return;

        const res = await fetch(STATUS_URL, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        const json = await res.json();

        // statusは通知を出さず、状態だけ更新（本番UIっぽく）
        setChecked(json.checked);
        setCheckedAt(json.checkedAt ?? null);
    }

    useEffect(() => {
        if (user) {
            getStatus();
        } else {
            setChecked(null);
            setCheckedAt(null);
        }
    }, [user]);

    return (
        <div style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
            <h1>今日も無事？</h1>

            {!user ? (
                <>
                    <div style={{ display: "grid", gap: 8 }}>
                        <input
                            placeholder="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            placeholder="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                        <button onClick={login}>ログイン</button>
                        <button onClick={signup}>新規登録</button>
                    </div>
                </>
            ) : (
                <>
                    <p>ログイン中: {user.email}</p>

                    <div style={{ display: "flex", gap: 8 }}>
                        <button
                            onClick={checkin}
                            disabled={checked === true}
                            style={{
                                fontSize: 18,
                                padding: "12px 16px",
                                opacity: checked === true ? 0.6 : 1,
                                cursor: checked === true ? "not-allowed" : "pointer",
                            }}
                        >
                            {checked === true ? "今日は確認済み ✅" : "今日も無事 ✅"}
                        </button>

                        <button onClick={getStatus}>今日の状態を見る</button>
                        <button onClick={logout}>ログアウト</button>
                    </div>

                    {checked !== null && (
                        <p style={{ marginTop: 8 }}>
                            今日の状態: {checked ? "✅ 確認済み" : "⏳ 未確認"}
                            {checked && checkedAt
                                ? `（${new Date(checkedAt).toLocaleString("ja-JP")}）`
                                : ""}
                        </p>
                    )}
                </>
            )}

            {notice && (
                <p
                    style={{
                        marginTop: 16,
                        padding: 10,
                        borderRadius: 8,
                        border: "1px solid #ccc",
                        color: notice.type === "error" ? "#b00020" : "#222",
                        background: notice.type === "error" ? "#ffecec" : "#f5f5f5",
                    }}
                >
                    {notice.text}
                </p>
            )}

        </div>
    );
}
