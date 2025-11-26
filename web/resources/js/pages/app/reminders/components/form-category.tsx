import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

const FormCategory: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 mb-4">
      <Input name="title" type="text" placeholder="Nombre" />
      <Input name="description" type="text" placeholder="Descripción" />
    </div>
  );
};

export default FormCategory;
