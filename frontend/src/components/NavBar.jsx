import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, Bell, ArrowLeftRight } from "lucide-react";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Avatar } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { setUser } from "../redux/authSlice";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const NavBar = () => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [notifications, setNotifications] = useState([]);
  const [openNotif, setOpenNotif] = useState(false);

  //charger les notifications
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8000/api/v1/notifications",
          { withCredentials: true }
        );
        setNotifications(data.notifications);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotifications();
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/logout", {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setUser(null));
        navigate("/");
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  //notification click
  const handleNotificationClick = async (notif) => {
    try {
      if (!notif.isRead) {
        await axios.patch(
          `http://localhost:8000/api/v1/notifications/${notif._id}/read`,
          {},
          { withCredentials: true }
        );

        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
        );
      }

      setOpenNotif(false);
      navigate(notif.link);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="py-4 fixed w-full shadow bg-cyan-950 text-white z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
        <div className="flex items-center gap-3">
          <Link to="/announcements" className="flex items-center gap-2 group">
            <div className="p-2 rounded-xl bg-cyan-900 group-hover:bg-cyan-800 transition">
              <ArrowLeftRight className="w-5 h-5 text-white" />
            </div>
            <span className="hidden sm:block font-semibold tracking-wide">
              Echange
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <nav>
            <ul className="flex items-center gap-6 font-medium">
              <Link to="/announcements">
                <li className="hover:text-cyan-300 cursor-pointer">Annonces</li>
              </Link>
              <Link to="/about">
                <li className="hover:text-cyan-300 cursor-pointer">A propos de nous</li>
              </Link>
            </ul>
          </nav>

          {user ? (
            <div className="flex items-center gap-4 relative">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage
                      src={user?.photoUrl || "https://via.placeholder.com/150"}
                    />
                    <AvatarFallback>
                      {user?.firstName?.[0]}
                      {user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                  <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/ads">Mes annonces</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/demandes">Messages</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/requests">Demandes</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={logoutHandler}
                    className="text-red-600"
                  >
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="relative">
                <Bell
                  className="w-6 h-6 cursor-pointer hover:text-cyan-300"
                  onClick={() => setOpenNotif(!openNotif)}
                />

                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}

                {openNotif && (
                  <div className="absolute right-0 mt-3 w-80 bg-white text-black rounded-xl shadow-xl z-50">
                    <div className="p-3 font-bold border-b">Notifications</div>

                    {notifications.length === 0 ? (
                      <p className="p-4 text-sm text-gray-500">
                        Aucune notification
                      </p>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif._id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`p-3 text-sm cursor-pointer hover:bg-gray-100 ${
                            !notif.isRead ? "bg-blue-50 font-semibold" : ""
                          }`}
                        >
                          <p>{notif.message}</p>
                          <span className="text-xs text-gray-400">
                            {new Date(notif.createdAt).toLocaleString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login">
                <Button
                  className="
        bg-white
        text-cyan-950
        hover:bg-white
        hover:text-cyan-950
        transition-colors duration-200
      "
                >
                  Se connecter
                </Button>
              </Link>

              <Link to="/signup">
                <Button
                  className="
        bg-cyan-800
        text-white
        hover:bg-cyan-700
        transition-colors duration-200
      "
                >
                  S'inscrire
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
