import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import type { ReactNode} from "react";

export default async function DashboardLayout ({children}: {children: ReactNode}) {
    const cookieStore = await cookies();
    const authToken =  cookieStore.get('auth_token');

    if (!authToken){
        redirect('/login');
    }

    const tokenPayload = verifyToken(authToken.value);

    if(!tokenPayload){
        redirect('/login');
    }

    return <>{children}</>;
}