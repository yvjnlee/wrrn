import React from "react";
import { createClient } from "@/utils/supabase/server";

export default async function Layout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <>
            {user && (
                <>
                    <div className="w-full">
                        {children}
                    </div>
                </>
            )}
        </>
    );
  }
  