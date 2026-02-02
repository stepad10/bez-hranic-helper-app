import { dispatch } from "../../store/gameStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Globe } from "lucide-solid";

export function WelcomeScreen() {
    const handlePassNPlay = () => {
        dispatch({ type: "ENTER_SETUP" });
    };

    const handleOnlinePlay = () => {
        // No-op for now
        alert("Online Play is coming soon!");
    };

    return (
        <div class="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 p-6 text-slate-100">
            <h1 class="mb-12 text-6xl font-black tracking-tight text-white drop-shadow-2xl">Without Borders</h1>

            <div class="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
                {/* Local Play Card */}
                <Card class="border-white/10 bg-white/5 transition-all hover:bg-white/10 hover:shadow-2xl hover:shadow-blue-500/20">
                    <CardHeader>
                        <CardTitle class="flex items-center gap-2 text-2xl text-white">
                            <Users class="h-6 w-6 text-blue-400" />
                            Pass 'n Play
                        </CardTitle>
                        <CardDescription class="text-slate-400">Play locally on this device with friends.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p class="mb-6 text-sm text-slate-400">Perfect for game nights. Share the device and plan your routes together.</p>
                        <Button onClick={handlePassNPlay} size="lg" class="w-full bg-blue-600 text-lg font-bold hover:bg-blue-500 shadow-lg shadow-blue-500/20">
                            Play Local
                        </Button>
                    </CardContent>
                </Card>

                {/* Online Play Card (Disabled) */}
                <Card class="border-white/5 bg-transparent opacity-60 transition-all">
                    <CardHeader>
                        <CardTitle class="flex items-center gap-2 text-2xl text-slate-300">
                            <Globe class="h-6 w-6 text-slate-500" />
                            Online Play
                        </CardTitle>
                        <CardDescription class="text-slate-500">Challenge players from around the world.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p class="mb-6 text-sm text-slate-500">Matchmaking and private lobbies coming soon in future updates.</p>
                        <Button
                            onClick={handleOnlinePlay}
                            variant="outline"
                            size="lg"
                            class="w-full cursor-not-allowed border-slate-700 bg-transparent text-slate-500 hover:bg-transparent"
                            disabled
                        >
                            Coming Soon
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <p class="mt-16 text-sm text-slate-600">v1.0.0 Alpha</p>
        </div>
    );
}
