"use client";

import { useState } from "react";
import CarnetSteps from "./CarnetSteps";
import BuscarAfiliado from "./BuscarAfiliado";
import DatosGenerales from "./DatosGenerales";
import DatosConyuge from "./DatosConyuge";
import Referencias from "./Referencias";
import Beneficiarios from "./Beneficiarios";
import CapturaFoto from "./CapturaFoto";

const STEPS = [
  { label: "Docente", description: "Búsqueda y datos generales" },
  { label: "Cónyuge", description: "Datos del cónyuge" },
  { label: "Referencias", description: "Familiar y personal" },
  { label: "Beneficiarios", description: "Lista y validación" },
  { label: "Fotografía", description: "Captura en sitio" },
];

export default function CarnetizacionPage() {
  const [step, setStep] = useState(0);
  const [maxStepReached, setMaxStepReached] = useState(0);

  const [afiliado, setAfiliado] = useState<any | null>(null);
  const [datosGenerales, setDatosGenerales] = useState({
    nombreCompleto: "",
    dni: "",
    lugarFechaNacimiento: "",
    rtn: "",
    estadoCivil: "",
    sexo: "",
    telefono: "",
  });
  const [datosConyuge, setDatosConyuge] = useState<any>({
    nombre: "",
    dni: "",
    fechaNacimiento: "",
    telefono: "",
    domicilio: "",
    departamento: "",
    municipio: "",
    aldea: "",
    direccionCompleta: "",
    correo: "",
  });
  const [referencias, setReferencias] = useState<any>({
    familiar: { nombre: "", parentesco: "", telefono: "" },
    personal: { nombre: "", parentesco: "", telefono: "" },
  });
  const [beneficiarios, setBeneficiarios] = useState<any[]>([
    {
      nombre: "MARÍA JOSÉ PÉREZ",
      identidad: "0801-2000-12345",
      fechaNacimiento: "14/05/2000",
    },
    {
      nombre: "CARLOS ANDRÉS PÉREZ",
      identidad: "0801-2003-54321",
      fechaNacimiento: "02/09/2003",
    },
  ]);
  const [foto, setFoto] = useState<string | null>(null);

  const isStepValid = (s: number) => {
    switch (s) {
      case 0:
        return (
          !!afiliado &&
          datosGenerales.nombreCompleto.trim() !== "" &&
          datosGenerales.dni.trim() !== "" &&
          datosGenerales.lugarFechaNacimiento.trim() !== "" &&
          datosGenerales.estadoCivil.trim() !== "" &&
          datosGenerales.sexo.trim() !== "" &&
          datosGenerales.telefono.trim() !== ""
        );
      case 1:
        return (
          datosConyuge.nombre.trim() !== "" &&
          datosConyuge.dni.trim() !== "" &&
          datosConyuge.fechaNacimiento.trim() !== ""
        );
      case 2:
        return (
          referencias.familiar.nombre.trim() !== "" &&
          referencias.familiar.telefono.trim() !== "" &&
          referencias.personal.nombre.trim() !== "" &&
          referencias.personal.telefono.trim() !== ""
        );
      case 3:
        return beneficiarios.length > 0;
      case 4:
        return !!foto;
      default:
        return false;
    }
  };

  const goNext = () => {
    if (isStepValid(step) && step < STEPS.length - 1) {
      const next = step + 1;
      setStep(next);
      setMaxStepReached((prev) => (next > prev ? next : prev));
    }
  };

  const goBack = () => {
    if (step > 0) {
      setStep((s) => s - 1);
    }
  };

  const handleStepClick = (idx: number) => {
    if (idx <= maxStepReached) {
      setStep(idx);
    }
  };

  return (
    <div className="page-shell">
      <div className="mb-6">
        <h1>Carnetización</h1>
        <p className="text-sm text-ink-500 mt-1">
          Completa todos los pasos para registrar al docente.
        </p>
      </div>

      <div className="panel p-4 sm:p-5 lg:p-6 space-y-6">
        <CarnetSteps
          steps={STEPS}
          current={step}
          maxReached={maxStepReached}
          onStepClick={handleStepClick}
        />

        <div className="pt-4 divider">
          {step === 0 && (
            <div className="space-y-6">
              <BuscarAfiliado
                onResult={(af) => {
                  setAfiliado(af);
                  setDatosGenerales((prev) => ({
                    ...prev,
                    nombreCompleto: af.nombre,
                    dni: af.numeroIdentificacion,
                    lugarFechaNacimiento:
                      af.fechaNacimiento || prev.lugarFechaNacimiento,
                  }));
                }}
              />

              {afiliado && (
                <div className="space-y-4">
                  <DatosGenerales
                    value={datosGenerales}
                    onChange={setDatosGenerales}
                  />
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={goNext}
                      disabled={!isStepValid(0)}
                      className="btn-primary"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 1 && (
            <DatosConyuge
              value={datosConyuge}
              onChange={setDatosConyuge}
              onNext={goNext}
              onBack={goBack}
            />
          )}

          {step === 2 && (
            <Referencias
              value={referencias}
              onChange={setReferencias}
              onNext={goNext}
              onBack={goBack}
            />
          )}

          {step === 3 && (
            <Beneficiarios
              value={beneficiarios}
              onChange={setBeneficiarios}
              onNext={goNext}
              onBack={goBack}
            />
          )}

          {step === 4 && (
            <CapturaFoto
              foto={foto}
              onFoto={setFoto}
              onBack={goBack}
              onFinish={() => {
                if (isStepValid(4)) {
                  alert("Listo para enviar ✅");
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}