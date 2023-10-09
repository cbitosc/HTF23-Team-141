import prisma from "@/lib/db"
import * as argon2 from "argon2"

export async function POST(request: Request) {
    
    const body = await request.json()
    const existingUser = await prisma.user.findUnique({where: {
        email: body.email
    }})
    if(existingUser){
        return Response.json({message:"User already exists!"},{status:409})
    }
    const hashedPassword = await argon2.hash(body.password);
    const user = await prisma.user.create({
        data: {
            email: body.email,
            name: body.name,
            password: hashedPassword
        }
    })
    
    console.log(existingUser)
    return Response.json({status:"OK"})
  }