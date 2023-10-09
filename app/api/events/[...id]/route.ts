import prisma from '@/lib/db';
import { getSession } from 'next-auth/react';
import { authOptions } from '../../auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  console.log('--------sess', params);
  const id = params.id[0];
  let event;
  if (params.id[1] === 'register') {
    event = await prisma.event.update({
      where: {
        id,
      },
      data: {
        registeredUsers: {
          connect: {
            id: session.user.id,
          },
        },
      },
      include: {
        hostedBy: true,
        registeredUsers: {
          select: {
            id: true,
          },
        },
      },
    });
  } else {
    event = await prisma.event.findUnique({
      where: {
        id,
      },
      include: {
        hostedBy: true,
        registeredUsers: {
          select: {
            id: true,
          },
        },
      },
    });
  }
  event.isRegistered = event?.registeredUsers.map((e) => e.id).includes(session?.user.id);
  event.usersRegistered = event?.registeredUsers.length;
  delete event?.registeredUsers;
  return Response.json({ event });
}
