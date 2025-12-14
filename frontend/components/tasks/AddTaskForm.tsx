'use client';

import * as React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Task } from '@/types/task';

export interface AddTaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (task: Partial<Task>) => Promise<void>;
  initialData?: Partial<Task>;
}

export const AddTaskForm: React.FC<AddTaskFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}) => {
  const [title, setTitle] = React.useState(initialData?.title || '');
  const [description, setDescription] = React.useState(initialData?.description || '');
  const [category, setCategory] = React.useState(initialData?.category || '');
  const [tags, setTags] = React.useState(initialData?.tags?.join(', ') || '');
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (open) {
      setTitle(initialData?.title || '');
      setDescription(initialData?.description || '');
      setCategory(initialData?.category || '');
      setTags(initialData?.tags?.join(', ') || '');
      setErrors({});
    }
  }, [open, initialData]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > 200) {
      newErrors.title = 'Title must be 200 characters or less';
    }
    
    if (description && description.length > 1000) {
      newErrors.description = 'Description must be 1000 characters or less';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    try {
      const tagArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        category: category.trim() || undefined,
        tags: tagArray.length > 0 ? tagArray : undefined,
      });
      
      onOpenChange(false);
    } catch (error) {
      setErrors({ submit: 'Failed to save task. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={initialData ? 'Edit Task' : 'Add New Task'}
      description={initialData ? 'Update task details' : 'Create a new task to stay organized'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
          placeholder="Enter task title"
          floatingLabel
          autoFocus
        />

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full min-h-[100px] px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary resize-none"
            placeholder="Enter task description (optional)"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-error">{errors.description}</p>
          )}
        </div>

        <Input
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g., Work, Personal, Shopping"
          floatingLabel={false}
        />

        <Input
          label="Tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Separate tags with commas"
          floatingLabel={false}
        />

        {errors.submit && (
          <p className="text-sm text-error">{errors.submit}</p>
        )}

        <div className="flex gap-3 justify-end pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {initialData ? 'Update Task' : 'Add Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
