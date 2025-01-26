import { Option, Select } from "@material-tailwind/react";

import Avatar from "react-avatar";
import { User } from "@generated/graphql";
import { onChange } from "@material-tailwind/react/types/components/select";

interface UserSelectProps {
  users: User[];
  value?: string;
  error?: boolean;
  onChange: onChange;
  label: string;
  disabled?: boolean;
}

export const UserSelect = ({
  users,
  value,
  error,
  onChange,
  label,
  disabled,
}: UserSelectProps) => {
  return (
    <Select
      label={label}
      error={!!error}
      value={value ?? ""}
      onChange={onChange}
      disabled={disabled}
      containerProps={{ className: "min-w-full" }}
      selected={() => {
        if (!value) {
          return (
            <div className="flex items-center gap-2">
              <Avatar name="Unassigned" size="20" round={true} />
              Unassigned
            </div>
          );
        }
        const user = users.find((u) => u.id === value);
        return (
          <div className="flex items-center gap-2">
            <Avatar name={user?.name} size="20" round={true} />
            {user?.name}
          </div>
        );
      }}
    >
      <Option value="" className="flex items-center gap-2">
        <Avatar name="Unassigned" size="20" round={true} color="grey" />
        Unassigned
      </Option>

      {users.map(({ id, name }) => (
        <Option key={id} value={id} className="flex items-center gap-2">
          <Avatar name={name} size="20" round={true} />
          {name}
        </Option>
      ))}
    </Select>
  );
};
