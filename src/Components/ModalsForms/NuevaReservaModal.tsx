import { useState } from "react";
import {
  Modal,
  Button,
  TextInput,
  Group,
  Select,
  Checkbox,
  Tabs,
  Flex,
  Title,
  Divider,
  Text,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";

export default function NuevaReservaModal() {
  const [opened, setOpened] = useState(false);

  const form = useForm({
    initialValues: {
      guestName: "Cliente de Paso",
      motivo: "",
      checkIn: new Date(),
      checkOut: new Date(),
      pricelist: "Benelux (USD)",
      currency: "USD",
      source: "Direct",
      hotel: "Hilton Grand",
      viaAgent: false,
    },
  });

  return (
    <>
      <Button onClick={() => setOpened(true)}>Nueva Reserva</Button>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Nueva Reserva"
        size="80%"
        radius="md"
        overlayProps={{ backgroundOpacity: 0.5, blur: 2 }}
      >
        {/* Botones superiores */}
        <Group justify="space-between" mb="md">
          <Group>
            <Button color="gray" variant="default">
              Send by Email
            </Button>
            <Button color="indigo">Advance Payment</Button>
          </Group>
          <Group>
            <Button variant="outline" color="gray">
              Draft
            </Button>
            <Button variant="outline" color="green">
              Confirmada
            </Button>
            <Button variant="outline" color="blue">
              Check-In
            </Button>
            <Button variant="outline" color="orange">
              Check-Out
            </Button>
            <Button variant="outline" color="red">
              Limpieza Necesaria
            </Button>
          </Group>
        </Group>

        <Divider mb="md" />

        {/* Sección principal del formulario */}
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
          <Title order={3} mb="md">
            New
          </Title>

          <Flex gap="lg" wrap="wrap">
            <Flex direction="column" flex={1} gap="sm">
              <TextInput label="Guest Name" {...form.getInputProps("guestName")} />
              <TextInput
                label="Motivo de Viaje"
                placeholder="Ej: Negocios, Turismo, Familia, etc."
                {...form.getInputProps("motivo")}
              />
              <DateTimePicker label="Check In" {...form.getInputProps("checkIn")} />
              <DateTimePicker label="Check Out" {...form.getInputProps("checkOut")} />
              <Group mt="sm" align="center">
                <Text>Responsible:</Text>
                <img
                  src="https://avatars.githubusercontent.com/u/9919?s=40&v=4"
                  alt="Admin"
                  width={30}
                  style={{ borderRadius: "50%" }}
                />
                <Text fw={500}>Mitchell Admin</Text>
              </Group>
            </Flex>

            <Flex direction="column" flex={1} gap="sm">
              <TextInput label="Pricelist" {...form.getInputProps("pricelist")} />
              <TextInput label="Currency" {...form.getInputProps("currency")} />
              <TextInput label="Source" {...form.getInputProps("source")} />
              <TextInput label="Hotel" {...form.getInputProps("hotel")} />
              <Checkbox
                label="Via Agent"
                {...form.getInputProps("viaAgent", { type: "checkbox" })}
              />
            </Flex>
          </Flex>

          {/* Tabs secciones inferiores */}
          <Tabs defaultValue="folio" mt="xl">
            <Tabs.List>
              <Tabs.Tab value="folio">Folio</Tabs.Tab>
              <Tabs.Tab value="customer">Customer Document</Tabs.Tab>
              <Tabs.Tab value="extra">Extra Infos</Tabs.Tab>
              <Tabs.Tab value="precios">Información de Precios</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="folio" pt="md">
              <Text c="dimmed">Aquí iría la tabla de habitaciones agregadas...</Text>
            </Tabs.Panel>

            <Tabs.Panel value="customer" pt="md">
              <Text c="dimmed">Aquí irían los documentos del cliente...</Text>
            </Tabs.Panel>

            <Tabs.Panel value="extra" pt="md">
              <Text c="dimmed">Información adicional del huésped...</Text>
            </Tabs.Panel>

            <Tabs.Panel value="precios" pt="md">
              <Text c="dimmed">Resumen de precios y tarifas...</Text>
            </Tabs.Panel>
          </Tabs>

          {/* Botones inferiores */}
          <Group justify="flex-end" mt="xl">
            <Button variant="filled" color="violet" type="submit">
              Guardar
            </Button>
            <Button variant="default" onClick={() => setOpened(false)}>
              Descartar
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
}
