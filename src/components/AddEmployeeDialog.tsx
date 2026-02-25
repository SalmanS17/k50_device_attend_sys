import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Loader2 } from "lucide-react";

interface AddEmployeeFormData {
  name: string;
  user_id: string;
  department: string;
  designation: string;
}

const DEPARTMENTS = [
  "IT",
  "HR",
  "Finance",
  "Operations",
  "Sales",
  "Marketing",
  "Support",
  "Management",
  "Other",
];

export function AddEmployeeDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<AddEmployeeFormData>({
    name: "",
    user_id: "",
    department: "",
    designation: "",
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addEmployeeMutation = useMutation({
    mutationFn: async (data: AddEmployeeFormData) => {
      // Validate required fields
      if (!data.name || !data.user_id || !data.department) {
        throw new Error("Name, Employee ID, and Department are required");
      }

      // Check if employee with same user_id already exists
      const { data: existing, error: checkError } = await supabase
        .from("employees")
        .select("id")
        .eq("user_id", data.user_id)
        .single();

      if (existing) {
        throw new Error(`Employee with ID ${data.user_id} already exists`);
      }

      if (checkError && checkError.code !== "PGRST116") {
        throw checkError;
      }

      // Add the new employee
      const { error } = await supabase.from("employees").insert([
        {
          name: data.name,
          user_id: data.user_id,
          department: data.department,
          designation: data.designation || null,
        },
      ]);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Employee added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setOpen(false);
      setFormData({
        name: "",
        user_id: "",
        department: "",
        designation: "",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEmployeeMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Employee
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>
            Add a new employee to the system. The Employee ID should match the
            PIN on the K50 device.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              placeholder="e.g., John Doe"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              disabled={addEmployeeMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="user_id">Employee ID (K50 PIN) *</Label>
            <Input
              id="user_id"
              placeholder="e.g., 001 or 12345"
              value={formData.user_id}
              onChange={(e) =>
                setFormData({ ...formData, user_id: e.target.value })
              }
              disabled={addEmployeeMutation.isPending}
            />
            <p className="text-xs text-muted-foreground">
              This should match the PIN enrolled on the K50 device
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department *</Label>
            <Select
              value={formData.department}
              onValueChange={(value) =>
                setFormData({ ...formData, department: value })
              }
              disabled={addEmployeeMutation.isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="designation">Designation (Optional)</Label>
            <Input
              id="designation"
              placeholder="e.g., Senior Developer"
              value={formData.designation}
              onChange={(e) =>
                setFormData({ ...formData, designation: e.target.value })
              }
              disabled={addEmployeeMutation.isPending}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={addEmployeeMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={addEmployeeMutation.isPending}
              className="gap-2"
            >
              {addEmployeeMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Add Employee
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
