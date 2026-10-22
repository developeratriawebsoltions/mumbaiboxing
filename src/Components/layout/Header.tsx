"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Bell,
  Check,
  ChevronDown,
  LogOut,
  Trash2,
} from "lucide-react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

type Me = {
  email: string;
  role: string;
};

type BoxerHeader = {
  name: string;
};

type Notification = {
  id: number;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function Header() {
  const path = usePathname();
  const router = useRouter();

  const [me, setMe] =
    useState<Me | null>(null);

  const [boxer, setBoxer] =
    useState<BoxerHeader | null>(null);

  const [open, setOpen] =
    useState(false);

  const [notificationsOpen, setNotificationsOpen] =
    useState(false);

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [notificationsLoading, setNotificationsLoading] =
    useState(false);

  const ref =
    useRef<HTMLDivElement>(null);

  /*
   * =========================================================
   * LOAD USER
   * =========================================================
   */

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      try {
        const response =
          await fetch("/api/auth/me", {
            cache: "no-store",
          });

        if (!response.ok) {
          return;
        }

        const data =
          await response.json();

        if (!cancelled && data?.email) {
          setMe({
            email: data.email,
            role: data.role ?? "",
          });
        }
      } catch {
        // Ignore authentication fetch errors
      }
    }

    loadUser();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * =========================================================
   * LOAD BOXER NAME
   * =========================================================
   */

  useEffect(() => {
    if (path !== "/dashboard/boxer") {
      setBoxer(null);
      return;
    }

    let cancelled = false;

    async function loadBoxer() {
      try {
        const response =
          await fetch("/api/boxer", {
            cache: "no-store",
          });

        if (!response.ok) {
          return;
        }

        const data =
          await response.json();

        if (!cancelled && data?.name) {
          setBoxer({
            name: data.name,
          });
        }
      } catch {
        // Ignore boxer fetch errors
      }
    }

    loadBoxer();

    return () => {
      cancelled = true;
    };
  }, [path]);

  /*
   * =========================================================
   * LOAD NOTIFICATIONS
   * =========================================================
   */

  async function loadNotifications() {
    try {
      setNotificationsLoading(true);

      const response =
        await fetch("/api/notifications", {
          cache: "no-store",
        });

      if (!response.ok) {
        return;
      }

      const data =
        await response.json();

      const notificationList =
        Array.isArray(data)
          ? data
          : data?.notifications ?? [];

      setNotifications(
        notificationList
      );
    } catch {
      // Ignore notification loading errors
    } finally {
      setNotificationsLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  /*
   * =========================================================
   * UNREAD COUNT
   * =========================================================
   */

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.read
    ).length;

  /*
   * =========================================================
   * CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
   * =========================================================
   */

  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent
    ) {
      if (
        ref.current &&
        !ref.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
        setNotificationsOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  /*
   * =========================================================
   * LOGOUT
   * =========================================================
   */

  async function handleLogout() {
    try {
      await fetch(
        "/api/auth/logout",
        {
          method: "POST",
        }
      );
    } catch {
      // Still redirect if logout request fails
    } finally {
      router.push("/login");
    }
  }

  /*
   * =========================================================
   * MARK NOTIFICATION AS READ
   * =========================================================
   */

  async function markNotificationAsRead(
    id: number
  ) {
    try {
      const response =
        await fetch(
          `/api/notifications/${id}/read`,
          {
            method: "PATCH",
          }
        );

      if (!response.ok) {
        return;
      }

      setNotifications(
        (current) =>
          current.map(
            (notification) =>
              notification.id === id
                ? {
                    ...notification,
                    read: true,
                  }
                : notification
          )
      );
    } catch {
      // Ignore update errors
    }
  }

  /*
   * =========================================================
   * DELETE NOTIFICATION
   * =========================================================
   */

  async function deleteNotification(
    id: number
  ) {
    try {
      const response =
        await fetch(
          `/api/notifications/${id}`,
          {
            method: "DELETE",
          }
        );

      if (!response.ok) {
        return;
      }

      setNotifications(
        (current) =>
          current.filter(
            (notification) =>
              notification.id !== id
          )
      );
    } catch {
      // Ignore delete errors
    }
  }

  /*
   * =========================================================
   * USER DISPLAY
   * =========================================================
   */

  const initial =
    boxer?.name?.charAt(0).toUpperCase() ||
    me?.email?.charAt(0).toUpperCase() ||
    "?";

  const displayName =
    boxer?.name ||
    me?.email ||
    "Member";

  const displayRole =
    me?.role
      ? me.role.charAt(0).toUpperCase() +
        me.role.slice(1)
      : "Member";

  /*
   * =========================================================
   * HEADER
   * =========================================================
   */

  return (
    <header
      className="
        h-[82px]
        bg-white
        border-b
        border-slate-100
        flex
        items-center
        justify-between
        px-5
        sm:px-8
        lg:px-11
        sticky
        top-0
        z-30
      "
    >

      {/* ===================================================
          MOBILE BRAND
          =================================================== */}

      <div className="lg:hidden">
        <p
          className="
            font-extrabold
            text-slate-900
            leading-[1.05]
            tracking-tight
          "
        >
          MUMBAI
          <br />
          BOXING ASSOCIATION
        </p>
      </div>

      {/* ===================================================
          RIGHT SIDE
          =================================================== */}

      <div
        ref={ref}
        className="
          flex
          items-center
          gap-3
          sm:gap-4
          ml-auto
        "
      >

        {/* =================================================
            NOTIFICATIONS
            ================================================= */}

        <div className="relative">

          <button
            type="button"
            onClick={() => {
              setNotificationsOpen(
                (value) => !value
              );

              setOpen(false);

              /*
               * Refresh notifications whenever
               * the dropdown is opened.
               */
              if (!notificationsOpen) {
                loadNotifications();
              }
            }}
            aria-label="Notifications"
            aria-expanded={
              notificationsOpen
            }
            className="
              relative
              w-11
              h-11
              rounded-full
              flex
              items-center
              justify-center
              text-slate-700
              hover:bg-slate-50
              transition-colors
            "
          >

            <Bell
              size={23}
              strokeWidth={1.8}
            />

            {/* ONLY SHOW BADGE IF UNREAD EXISTS */}

            {unreadCount > 0 && (
              <span
                className="
                  absolute
                  top-0.5
                  right-0.5
                  min-w-[19px]
                  h-[19px]
                  px-1
                  rounded-full
                  bg-[#ed1c24]
                  text-white
                  text-[10px]
                  font-bold
                  flex
                  items-center
                  justify-center
                  border-2
                  border-white
                "
              >
                {unreadCount > 99
                  ? "99+"
                  : unreadCount}
              </span>
            )}

          </button>

          {/* =================================================
              NOTIFICATION DROPDOWN
              ================================================= */}

          {notificationsOpen && (
            <div
              className="
                absolute
                right-0
                mt-3
                w-[370px]
                max-w-[calc(100vw-2rem)]
                bg-white
                border
                border-slate-100
                rounded-2xl
                shadow-xl
                overflow-hidden
                z-50
              "
            >

              {/* Header */}

              <div
                className="
                  px-5
                  py-4
                  border-b
                  border-slate-100
                  flex
                  items-center
                  justify-between
                "
              >

                <div>
                  <p
                    className="
                      font-semibold
                      text-slate-900
                    "
                  >
                    Notifications
                  </p>

                  {unreadCount > 0 && (
                    <p
                      className="
                        text-xs
                        text-slate-400
                        mt-0.5
                      "
                    >
                      {unreadCount} unread
                    </p>
                  )}
                </div>

                {notifications.length > 0 && (
                  <span
                    className="
                      text-xs
                      font-medium
                      text-slate-400
                    "
                  >
                    {notifications.length}
                  </span>
                )}

              </div>

              {/* =================================================
                  CONTENT
                  ================================================= */}

              <div className="max-h-[430px] overflow-y-auto">

                {/* LOADING */}

                {notificationsLoading ? (

                  <div
                    className="
                      px-5
                      py-12
                      text-center
                    "
                  >

                    <div
                      className="
                        w-7
                        h-7
                        border-2
                        border-slate-200
                        border-t-red-600
                        rounded-full
                        animate-spin
                        mx-auto
                      "
                    />

                    <p
                      className="
                        text-xs
                        text-slate-400
                        mt-3
                      "
                    >
                      Loading notifications...
                    </p>

                  </div>

                ) : notifications.length === 0 ? (

                  /* EMPTY STATE */

                  <div
                    className="
                      px-5
                      py-12
                      text-center
                    "
                  >

                    <div
                      className="
                        w-14
                        h-14
                        mx-auto
                        rounded-full
                        bg-slate-50
                        text-slate-400
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <Bell
                        size={24}
                        strokeWidth={1.7}
                      />
                    </div>

                    <p
                      className="
                        mt-4
                        text-sm
                        font-semibold
                        text-slate-700
                      "
                    >
                      No notifications
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-slate-400
                      "
                    >
                      You're all caught up.
                    </p>

                  </div>

                ) : (

                  /* NOTIFICATION LIST */

                  <div>
                    {notifications.map(
                      (notification) => (
                        <div
                          key={notification.id}
                          className={`
                            px-5
                            py-4
                            border-b
                            border-slate-100
                            last:border-b-0
                            ${
                              notification.read
                                ? "bg-white"
                                : "bg-red-50/30"
                            }
                          `}
                        >

                          <div className="flex gap-3">

                            {/* Unread indicator */}

                            <div className="pt-1.5 shrink-0">
                              <span
                                className={`
                                  block
                                  w-2
                                  h-2
                                  rounded-full
                                  ${
                                    notification.read
                                      ? "bg-slate-300"
                                      : "bg-red-500"
                                  }
                                `}
                              />
                            </div>

                            {/* Notification content */}

                            <div className="flex-1 min-w-0">

                              <p
                                className={`
                                  text-sm
                                  font-semibold
                                  ${
                                    notification.read
                                      ? "text-slate-600"
                                      : "text-slate-900"
                                  }
                                `}
                              >
                                {notification.title}
                              </p>

                              <p
                                className="
                                  text-xs
                                  text-slate-500
                                  mt-1
                                  leading-relaxed
                                "
                              >
                                {notification.message}
                              </p>

                              <p
                                className="
                                  text-[11px]
                                  text-slate-400
                                  mt-2
                                "
                              >
                                {new Date(
                                  notification.createdAt
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </p>

                              {/* ACTIONS */}

                              <div
                                className="
                                  flex
                                  items-center
                                  gap-4
                                  mt-3
                                "
                              >

                                {!notification.read && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      markNotificationAsRead(
                                        notification.id
                                      )
                                    }
                                    className="
                                      inline-flex
                                      items-center
                                      gap-1.5
                                      text-xs
                                      font-semibold
                                      text-emerald-600
                                      hover:text-emerald-700
                                      transition-colors
                                    "
                                  >
                                    <Check
                                      size={14}
                                      strokeWidth={2}
                                    />

                                    Mark as read
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() =>
                                    deleteNotification(
                                      notification.id
                                    )
                                  }
                                  className="
                                    inline-flex
                                    items-center
                                    gap-1.5
                                    text-xs
                                    font-semibold
                                    text-red-600
                                    hover:text-red-700
                                    transition-colors
                                  "
                                >
                                  <Trash2
                                    size={14}
                                    strokeWidth={2}
                                  />

                                  Delete
                                </button>

                              </div>

                            </div>

                          </div>

                        </div>
                      )
                    )}
                  </div>

                )}

              </div>

            </div>
          )}

        </div>

        {/* Divider */}

        <div
          className="
            h-9
            w-px
            bg-slate-200
          "
        />

        {/* =================================================
            PROFILE BUTTON
            ================================================= */}

        <button
          type="button"
          onClick={() => {
            setOpen(
              (value) => !value
            );

            setNotificationsOpen(false);
          }}
          aria-expanded={open}
          className="
            flex
            items-center
            gap-3
            rounded-xl
            px-2
            py-1.5
            hover:bg-slate-50
            transition-colors
          "
        >

          {/* Avatar */}

          <div
            className="
              w-11
              h-11
              rounded-full
              bg-[#ed1c24]
              text-white
              flex
              items-center
              justify-center
              text-base
              font-bold
              shrink-0
            "
          >
            {initial}
          </div>

          {/* Name */}

          <div
            className="
              hidden
              sm:block
              text-left
              max-w-[180px]
            "
          >

            <p
              className="
                text-sm
                font-semibold
                text-slate-900
                truncate
              "
            >
              {displayName}
            </p>

            <p
              className="
                text-xs
                text-slate-500
                mt-0.5
              "
            >
              {displayRole}
            </p>

          </div>

          {/* Chevron */}

          <ChevronDown
            size={18}
            strokeWidth={1.8}
            className="
              hidden
              sm:block
              text-slate-500
              ml-1
            "
          />

        </button>

        {/* =================================================
            PROFILE DROPDOWN
            ================================================= */}

        {open && (
          <div
            className="
              absolute
              right-5
              sm:right-8
              lg:right-11
              top-[72px]
              w-[270px]
              bg-white
              border
              border-slate-100
              rounded-2xl
              shadow-xl
              overflow-hidden
              z-50
            "
          >

            {/* User information */}

            <div
              className="
                px-5
                py-5
                border-b
                border-slate-100
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <div
                  className="
                    w-11
                    h-11
                    rounded-full
                    bg-[#ed1c24]
                    text-white
                    flex
                    items-center
                    justify-center
                    font-bold
                    shrink-0
                  "
                >
                  {initial}
                </div>

                <div className="min-w-0">

                  <p
                    className="
                      font-semibold
                      text-slate-900
                      truncate
                    "
                  >
                    {displayName}
                  </p>

                  <p
                    className="
                      text-xs
                      text-slate-500
                      mt-0.5
                    "
                  >
                    {displayRole}
                  </p>

                </div>

              </div>

              <p
                className="
                  text-xs
                  text-slate-400
                  mt-4
                  truncate
                "
              >
                {me?.email ?? ""}
              </p>

            </div>

            {/* Sign out */}

            <button
              type="button"
              onClick={handleLogout}
              className="
                w-full
                px-5
                py-3.5
                text-left
                text-sm
                font-medium
                text-red-600
                hover:bg-red-50
                transition-colors
                flex
                items-center
              "
            >

              <LogOut
                size={17}
                strokeWidth={1.9}
                className="mr-3 shrink-0"
              />

              Sign out

            </button>

          </div>
        )}

      </div>

    </header>
  );
}