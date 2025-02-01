import { BellIcon, ChevronDownIcon, PowerIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import {
  Avatar,
  Badge,
  Button,
  IconButton,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Navbar,
  Typography,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router";

import React from "react";
import { NotificationPopover } from "../components/NotificationPopover";
import { useNotificationsCountQuery } from "../state/notification";
import { useCurrentUserQuery } from "../state/user";

function ProfileMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogoutMenuClick = () => {
    setIsMenuOpen(false);
    navigate("/login");
  };

  const handleProfileMenuClick = () => {
    setIsMenuOpen(false);
    navigate("/profile");
  };

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
        >
          <Avatar
            variant="circular"
            size="sm"
            alt="tania andrew"
            className="border border-gray-900 p-0.5 h-20 w-20"
            src="/avatar.svg"
          />
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-1">
        <MenuItem onClick={handleProfileMenuClick} className={"flex items-center gap-2 rounded"}>
          {React.createElement(UserCircleIcon, {
            className: `h-4 w-4 text-black`,
            strokeWidth: 2,
          })}
          <Typography as="span" variant="small" className="font-normal" color={"black"}>
            Profile
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleLogoutMenuClick} className={"flex items-center gap-2 rounded"}>
          {React.createElement(PowerIcon, {
            className: `h-4 w-4 text-black`,
            strokeWidth: 2,
          })}
          <Typography as="span" variant="small" className="font-normal" color={"black"}>
            Logout
          </Typography>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

interface WithBadgeProps {
  count: number;
  children: React.ReactNode;
}

const WithBadge: React.FC<WithBadgeProps> = ({ count, children }) => {
  if (!count) {
    return children;
  }
  return <Badge content={count || ""}>{children}</Badge>;
};

interface MainNavProps {
  withProfileMenu?: boolean;
}

export const MainNav = ({ withProfileMenu = true }: MainNavProps) => {
  const { data, loading } = useCurrentUserQuery();
  const { length } = useNotificationsCountQuery();

  return (
    <Navbar className="min-w-full rounded-none h-28 flex items-center px-1 md:pl-4 md:pr-12">
      <div className="relative flex w-full items-center justify-between text-blue-gray-900">
        <Link to="/dashboard">
          <Typography className="mr-4 md:ml-2 cursor-pointer py-1.5 font-medium">
            <img className="mx-auto h-32" src="/logo.svg" alt="logo" />
          </Typography>
        </Link>
        {withProfileMenu && (
          <div className="flex gap-16 justify-center items-center">
            <WithBadge count={length || 0}>
              <NotificationPopover>
                <IconButton variant="text">
                  <BellIcon color="black" className="h-10 w-10" />
                </IconButton>
              </NotificationPopover>
            </WithBadge>
            <div className="flex gap-4 justify-center items-center">
              {!loading && (
                <Typography color="blue-gray" variant="lead">
                  {data?.user?.name}
                </Typography>
              )}
              <ProfileMenu />
            </div>
          </div>
        )}
      </div>
    </Navbar>
  );
};
