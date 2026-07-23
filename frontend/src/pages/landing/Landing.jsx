import {Button} from "../../components/ui/Button";
import {Input} from "../../components/ui/Input";
import {Badge} from "../../components/ui/Badge";
import {Card} from "../../components/ui/Card";
import {Navbar} from "../../components/Navbar";

function Landing() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="mx-auto flex max-w-md flex-col gap-5 p-8">
        <h1 className="text-2xl font-bold">
          Prueba de componentes
        </h1>

        <Input
          label="Correo electrónico"
          type="email"
          name="email"
          placeholder="correo@ejemplo.com"
        />

        <Card title="Requiere cambio de foquito">
          <p className="mb-3 text-gray-600">
            no tiene luz, foquitos quemados
          </p>

          <Badge variant="pending">Pendiente</Badge>
        </Card>

        <div className="flex gap-3">
          <Button onClick={() => alert("Funciona")}>
            Aceptar
          </Button>

          <Button variant="secondary">
            Cancelar
          </Button>

          <Button variant="danger">
            Eliminar
          </Button>
        </div>
      </div>
    </main>
  );
}

export default Landing;