import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Link } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";

interface AuthGuardButtonProps {
    children: React.ReactNode;
    className?: string;
    variant?: "default" | "outline" | "ghost" | "secondary" | "destructive" | "link";
    size?: "default" | "sm" | "lg" | "icon";
}

const AuthGuardButton = ({
    children,
    className,
    variant = "default",
    size = "default",
}: AuthGuardButtonProps) => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleClick = () => {
        if (isAuthenticated) {
            navigate("/create-blog");
        } else {
            setDialogOpen(true);
        }
    };

    return (
        <>
            <Button
                variant={variant}
                size={size}
                className={className}
                onClick={handleClick}
            >
                {children}
            </Button>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="font-display text-xl">
                            Create an account first
                        </DialogTitle>
                        <DialogDescription>
                            You need to sign in or create an account before you can write a story.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 pt-4">
                        <Button className="h-11 gap-2" asChild>
                            <Link to="/signup" onClick={() => setDialogOpen(false)}>
                                <UserPlus className="h-4 w-4" />
                                Create Account
                            </Link>
                        </Button>
                        <Button variant="outline" className="h-11 gap-2" asChild>
                            <Link to="/signin" onClick={() => setDialogOpen(false)}>
                                <LogIn className="h-4 w-4" />
                                Sign In
                            </Link>
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AuthGuardButton;
