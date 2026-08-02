import React, { useState } from "react";
import {
  useGetSuperAdminPagesQuery,
  useCreateSuperAdminPageMutation,
  useUpdateSuperAdminPageMutation,
  useDeleteSuperAdminPageMutation,
} from "../../api/superAdminPageApi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Spinner from "@/components/common/Spinner";
import { toast } from "react-hot-toast";

const PageManagement = () => {
  const {
    data: pagesRaw,
    isLoading: pagesLoading,
    error: pagesError,
  } = useGetSuperAdminPagesQuery();
  const pages = pagesRaw?.data || pagesRaw || [];
  const [createPage, { isLoading: createLoading }] =
    useCreateSuperAdminPageMutation();
  const [updatePage, { isLoading: updateLoading }] =
    useUpdateSuperAdminPageMutation();
  const [deletePage, { isLoading: deleteLoading }] =
    useDeleteSuperAdminPageMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    path: "",
    icon: "",
    component: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreate = () => {
    setSelectedPage(null);
    setFormData({ name: "", path: "", icon: "", component: "" });
    setIsDialogOpen(true);
  };

  const handleEdit = (page) => {
    setSelectedPage(page);
    setFormData({
      name: page.name,
      path: page.path,
      icon: page.icon,
      component: page.component,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deletePage(id).unwrap();
      toast.success("Page deleted successfully");
    } catch (error) {
      toast.error("Failed to delete page");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedPage) {
        await updatePage({ id: selectedPage._id, ...formData }).unwrap();
        toast.success("Page updated successfully");
      } else {
        await createPage(formData).unwrap();
        toast.success("Page created successfully");
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to save page");
    }
  };

  if (pagesLoading) return <Spinner />;
  if (pagesError) return <div>Error loading pages</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Page Management</h1>
        <Button onClick={handleCreate}>Create Page</Button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Path</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead>Component</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.map((page) => (
              <TableRow key={page._id}>
                <TableCell>{page.name}</TableCell>
                <TableCell>{page.path}</TableCell>
                <TableCell>{page.icon}</TableCell>
                <TableCell>{page.component}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(page)}
                    className="mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(page._id)}
                    disabled={deleteLoading}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedPage ? "Edit Page" : "Create Page"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="path" className="text-right">
                  Path
                </Label>
                <Input
                  id="path"
                  name="path"
                  value={formData.path}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="icon" className="text-right">
                  Icon
                </Label>
                <Input
                  id="icon"
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="component" className="text-right">
                  Component
                </Label>
                <Input
                  id="component"
                  name="component"
                  value={formData.component}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={createLoading || updateLoading}>
                Save
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PageManagement;
