import { formatDate } from "@/services/helpers";
import { Avatar, Badge, Descriptions, Drawer } from "antd";
import type { DescriptionsProps } from "antd";

interface IProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (value: boolean) => void;
  userDrawer: IUserTable;
}

const UsersDrawer = (props: IProps) => {
  const { isDrawerOpen, setIsDrawerOpen, userDrawer } = props;

  const itemsDrawer: DescriptionsProps["items"] = [
    {
      key: "id",
      label: "ID",
      children: userDrawer._id,
    },
    {
      key: "fullName",
      label: "Full Name",
      children: userDrawer.fullName,
    },
    {
      key: "email",
      label: "Email",
      children: userDrawer.email,
    },
    {
      key: "phone",
      label: "Phone number",
      children: userDrawer.phone,
    },
    {
      key: "role",
      label: "Role",
      children: <Badge status="processing" text={userDrawer.role} />,
    },
    {
      key: "avatar",
      label: "Avatar",
      children: (
        <Avatar
          size="large"
          src={`${import.meta.env.VITE_BACKEND_URL}/images/avatar/${userDrawer.avatar}`}
        />
      ),
    },
    {
      key: "createdAt",
      label: "Created At",
      children:
        userDrawer.createdAt === "" ? "" : formatDate(userDrawer.createdAt),
    },
    {
      key: "updatedAt",
      label: "Updated At",
      children:
        userDrawer.updatedAt === "" ? "" : formatDate(userDrawer.updatedAt),
    },
  ];

  return (
    <Drawer
      width="50vw"
      title="Detail User Infor"
      onClose={() => setIsDrawerOpen(false)}
      open={isDrawerOpen}
    >
      <Descriptions items={itemsDrawer} column={2} bordered />
    </Drawer>
  );
};

export default UsersDrawer;
