"use client";

import { useState, useEffect, createContext, useContext } from "react";

interface User {
  id: string;
  username: string;
}

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  users: User[];
}

const UserContext = createContext<UserContextType>({
  currentUser: null,
  setCurrentUser: () => {},
  users: [],
});

export function useCurrentUser() {
  return useContext(UserContext);
}

// 种子数据中的用户（与 seed.ts 对应）
const SEED_USERS: User[] = [
  { id: "user-seed-1", username: "小明" },
  { id: "user-seed-2", username: "旅人甲" },
  { id: "user-seed-3", username: "花花" },
];

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("travel-journal-user");
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const handleSelect = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem("travel-journal-user", JSON.stringify(user));
    setShowPicker(false);
  };

  return (
    <UserContext.Provider
      value={{ currentUser, setCurrentUser: handleSelect, users: SEED_USERS }}
    >
      {children}

      {/* 全局浮动用户切换器 */}
      <div className="fixed bottom-4 right-4 z-50">
        {currentUser ? (
          <button
            onClick={() => setShowPicker(!showPicker)}
            className="flex h-10 items-center gap-2 rounded-full bg-white px-4 shadow-lg ring-1 ring-gray-200 transition-shadow hover:shadow-xl"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
              {currentUser.username[0]}
            </div>
            <span className="text-sm font-medium text-gray-700">{currentUser.username}</span>
          </button>
        ) : (
          <button
            onClick={() => setShowPicker(true)}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-shadow hover:shadow-xl"
          >
            👤 选择身份
          </button>
        )}

        {showPicker && (
          <div className="absolute bottom-14 right-0 w-48 rounded-xl bg-white p-2 shadow-xl ring-1 ring-gray-200">
            <p className="mb-2 px-2 text-xs font-bold text-gray-400">切换身份</p>
            {SEED_USERS.map((user) => (
              <button
                key={user.id}
                onClick={() => handleSelect(user)}
                className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition-colors ${
                  currentUser?.id === user.id
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-[10px] font-medium">
                  {user.username[0]}
                </div>
                {user.username}
              </button>
            ))}
          </div>
        )}
      </div>
    </UserContext.Provider>
  );
}
