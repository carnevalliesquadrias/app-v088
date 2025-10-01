import React, { useEffect } from "react";
import { useApp, Product } from "../contexts/AppContext";
import { useSettings } from "../contexts/SettingsContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// 📌 Schema de validação em pt-BR
const productSchema = z.object({
  name: z.string().min(1, { message: "Campo obrigatório" }),
  description: z.string().optional(),
  category: z.string().min(1, { message: "Selecione uma categoria" }),
  type: z.enum(["material_bruto", "parte_produto", "produto_pronto"], {
    errorMap: () => ({ message: "Selecione um tipo" }),
  }),
  unit: z.string().min(1, { message: "Campo obrigatório" }),
  current_stock: z.coerce
    .number()
    .min(0, { message: "Estoque atual deve ser maior ou igual a 0" }),
  min_stock: z.coerce
    .number()
    .min(0, { message: "Estoque mínimo deve ser maior ou igual a 0" }),
  cost_price: z.coerce
    .number()
    .min(0.01, { message: "Informe um preço de custo válido" }),
  sale_price: z.coerce
    .number()
    .min(0, { message: "Preço de venda inválido" })
    .optional(),
  supplier: z.string().optional(),
  components: z
    .array(
      z.object({
        product_name: z.string().min(1, { message: "Nome do componente obrigatório" }),
        quantity: z.coerce
          .number()
          .min(1, { message: "Quantidade deve ser pelo menos 1" }),
        unit: z.string().min(1, { message: "Unidade obrigatória" }),
        total_cost: z.coerce
          .number()
          .min(0, { message: "Custo deve ser maior ou igual a 0" }),
      })
    )
    .optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

type ProductModalProps = {
  product?: Product | null;
  onClose: () => void;
};

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { addProduct, updateProduct } = useApp();
  const { productSettings } = useSettings();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      type: "material_bruto",
      unit: "",
      current_stock: 0,
      min_stock: 0,
      cost_price: 0,
      sale_price: undefined,
      supplier: "",
      components: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "components",
  });

  // Preencher dados no caso de edição
  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        category: product.category,
        type: product.type as any,
        unit: product.unit,
        current_stock: product.current_stock,
        min_stock: product.min_stock,
        cost_price: product.cost_price,
        sale_price: product.sale_price,
        supplier: product.supplier,
        components: product.components,
      });
    } else {
      reset();
    }
  }, [product, reset]);

  const onSubmit = (data: ProductFormData) => {
    const newProduct: Product = {
      id: product?.id || Date.now().toString(),
      ...data,
    };

    if (product) {
      updateProduct(newProduct);
    } else {
      addProduct(newProduct);
    }

    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? "Editar Produto" : "Novo Produto"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nome */}
          <div className="space-y-2">
            <Label>Nome do Produto</Label>
            <Input {...register("name")} />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea {...register("description")} />
          </div>

          {/* Categoria */}
          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select
              onValueChange={(val) => setValue("category", val)}
              defaultValue={product?.category}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {productSettings.categories.map((cat: string) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
          </div>

          {/* Tipo */}
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select
              onValueChange={(val) => setValue("type", val as any)}
              defaultValue={product?.type || "material_bruto"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="material_bruto">Material Bruto</SelectItem>
                <SelectItem value="parte_produto">Parte de Produto</SelectItem>
                <SelectItem value="produto_pronto">Produto Pronto</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
          </div>

          {/* Unidade */}
          <div className="space-y-2">
            <Label>Unidade</Label>
            <Input {...register("unit")} />
            {errors.unit && <p className="text-red-500 text-sm">{errors.unit.message}</p>}
          </div>

          {/* Estoques */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Estoque Atual</Label>
              <Input type="number" {...register("current_stock")} />
              {errors.current_stock && (
                <p className="text-red-500 text-sm">{errors.current_stock.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Estoque Mínimo</Label>
              <Input type="number" {...register("min_stock")} />
              {errors.min_stock && (
                <p className="text-red-500 text-sm">{errors.min_stock.message}</p>
              )}
            </div>
          </div>

          {/* Preços */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Preço de Custo</Label>
              <Input type="number" {...register("cost_price")} />
              {errors.cost_price && (
                <p className="text-red-500 text-sm">{errors.cost_price.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Preço de Venda (opcional)</Label>
              <Input type="number" {...register("sale_price")} />
              {errors.sale_price && (
                <p className="text-red-500 text-sm">{errors.sale_price.message}</p>
              )}
            </div>
          </div>

          {/* Fornecedor */}
          <div className="space-y-2">
            <Label>Fornecedor</Label>
            <Input {...register("supplier")} />
          </div>

          {/* Componentes */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between items-center mb-2">
              <Label>Componentes</Label>
              <Button
                size="sm"
                type="button"
                onClick={() =>
                  append({
                    product_name: "",
                    quantity: 1,
                    unit: "",
                    total_cost: 0,
                  })
                }
              >
                + Adicionar
              </Button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-5 gap-2 items-center">
                <Input
                  placeholder="Produto"
                  {...register(`components.${index}.product_name` as const)}
                />
                <Input
                  type="number"
                  placeholder="Qtd"
                  {...register(`components.${index}.quantity` as const)}
                />
                <Input
                  placeholder="Un"
                  {...register(`components.${index}.unit` as const)}
                />
                <Input
                  type="number"
                  placeholder="Custo"
                  {...register(`components.${index}.total_cost` as const)}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  Remover
                </Button>
              </div>
            ))}
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;