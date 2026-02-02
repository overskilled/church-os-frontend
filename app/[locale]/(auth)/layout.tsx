import { ReactNode } from "react";

export default function layout ({children}:{children: ReactNode}){
    return (
        <div className="w-full max-h-screen bg-muted flex items-center justify-center">
            <div className="w-2/5 relative">{children}</div>
            {/* <div className="w-3/5 border h-screen bg-primary"></div> */}
        </div>
    )
}