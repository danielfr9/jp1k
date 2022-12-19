import { type NextApiRequest, type NextApiResponse } from "next";

import { prisma } from "../../server/db/client";

// NOTE: This route is for reference

const examples = async (req: NextApiRequest, res: NextApiResponse) => {
  const examples = await prisma.card.findMany();
  res.status(200).json(examples);
};

export default examples;
