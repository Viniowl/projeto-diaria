import { Input } from "../ui/input"
import { Label } from "../ui/label"

export const DiariaLogForm = () => {
    return (
        <div className="grid gap-4">
            <h2 className="text-2xl font-bold">Adicionar Nova Diária</h2>
            <div>
                <Label htmlFor="date">Data</Label>
                <Input id= "date" type= "date" />
            </div>
            <div>
                <Label htmlFor="startTime">Hora de Início</Label>
                <Input id= "startTime" type= "time" />
            </div>
            <div>
                <Label htmlFor="endTime">Hora de Término</Label>
                <Input id = "endTime" type = "time" />
            </div>
        </div>
    );
};