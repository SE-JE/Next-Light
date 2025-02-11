import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";

type User = {
  id: number;
  name: string;
  email: string;
  address?: string;
  position?: string;
  avatar?: string;
  is_active: boolean;
  created_at?: string;
  created_by?: string;
};

let users: User[] = [
  {
    id: 1,
    name: "Joko Gunawan",
    email: "jokogunawan@gmail.com",
    address: "Jln Soekarno-Hatta No 27 C, Ponorogo, Jawa Timur, Indonesia",
    position: "Admin",
    avatar: "/avatar.jpg",
    is_active: true,
    created_at: "2025-01-01 09:00:00",
    created_by: "Joko Gunawan",
  },
  {
    id: 2,
    name: "Winanto",
    email: "winanto@gmail.com",
    address: "Jln Soekarno-Hatta No 28 C, Ponorogo, Jawa Timur, Indonesia",
    position: "Manager",
    avatar: "/avatar.jpg",
    is_active: false,
    created_at: "2025-01-01 09:00:00",
    created_by: "Joko Gunawan",
  },
  {
    id: 3,
    name: "Wina Putri Sulastri",
    email: "winaps@gmail.com",
    address: "Jln Soekarno-Hatta No 29 C, Ponorogo, Jawa Timur, Indonesia",
    position: "Marketing",
    is_active: true,
    created_at: "2025-01-01 09:00:00",
    created_by: "Joko Gunawan",
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;

  switch (method) {
    case "GET":
      let filteredUsers = users;

      if (query.search) {
        const searchTerm = query.search.toString().toLowerCase();
        filteredUsers = filteredUsers.filter((user) =>
          user.name.toLowerCase().includes(searchTerm)
        );
      }

      if (!filteredUsers.length) {
        res.status(204).json({
          message: "data empty",
          data: [],
        });
      }

      res.status(200).json({
        message: "success",
        data: users,
        total_row: filteredUsers.length,
      });
      break;

    case "POST":
      const newUser: User = {
        id: Date.now(),
        ...req.body,
        is_active: true,
        created_at: moment().format("YYYY-MM-DD hh:mm:ss"),
        created_by: "Joko Gunawan",
      };
      users.push(newUser);
      res.status(201).json({
        message: "success",
        data: newUser,
      });
      break;

    case "PUT":
      if (!query.id) {
        res.status(404).json({ message: "Id Not Found" });
        return;
      }
      const updateId = parseInt(query.id.toString());
      const { name, email, address, position, is_active } = req.body;
      users = users.map((user) =>
        user.id === updateId
          ? { ...user, name, email, address, position, is_active }
          : user
      );
      res.status(200).json({
        message: "Success",
        data: users?.find((user) => user?.id == updateId),
      });
      break;

    case "DELETE":
      if (!query.id) {
        res.status(404).json({ message: "Id Not Found" });
        return;
      }
      const deleteId = parseInt(query.id.toString());

      users = users.filter((user) => user.id !== req.body.id);
      res.status(200).json({
        message: "Success",
        data: users?.find((user) => user?.id == deleteId),
      });
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
