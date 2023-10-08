import prisma from "@/lib/db";

export async function GET() {
    const events = await prisma.event.findMany({include: {
        hostedBy: true
    }})
    return Response.json({events})   
}

export async function POST(req: Request) {
    const data = await req.json()
    console.log(data)
    const events = await prisma.event.create({data: {
        ...data
    }})
    return Response.redirect(`${process.env.NEXTAUTH_URL}/event/${events.id}`)   
}