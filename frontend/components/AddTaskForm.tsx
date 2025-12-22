'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreateTaskRequest } from '@/types/task';
import { cn } from '@/lib/utils';

// Define the validation schema using Zod
const addTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less'),
  description: z
    .string()
    .max(1000, 'Description must be 1000 characters or less')
    .optional()
    .or(z.literal('')),
  dueDate: z.string().optional().or(z.literal('')),
  category: z
    .string()
    .max(50, 'Category must be 50 characters or less')
    .optional()
    .or(z.literal('')),
  tags: z
    .string()
    .optional()
    .or(z.literal('')),
});

type AddTaskFormValues = z.infer<typeof addTaskSchema>;

interface AddTaskFormProps {
  onTaskCreate: (taskData: CreateTaskRequest) => Promise<void>;
  categories?: string[];
  tags?: string[];
  className?: string;
}

export function AddTaskForm({ onTaskCreate, categories = [], tags = [], className }: AddTaskFormProps) {
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
    watch,
  } = useForm<AddTaskFormValues>({
    resolver: zodResolver(addTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      dueDate: '',
      category: '',
      tags: '',
    },
  });

  const data = watch();

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setShowCategorySuggestions(false);
      }
      if (tagsRef.current && !tagsRef.current.contains(event.target as Node)) {
        setShowTagSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const onSubmit: SubmitHandler<AddTaskFormValues> = async (data) => {
    try {
      // Process tags (split by comma and clean up)
      const tagArray = data.tags
        ? data.tags
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0)
        : [];

      const taskData = {
        title: data.title.trim(),
        description: data.description?.trim(),
        dueDate: data.dueDate || undefined,
        category: data.category?.trim() || undefined,
        tags: tagArray.length > 0 ? tagArray : undefined,
      };

      await onTaskCreate(taskData);

      // Reset form only after successful submission
      reset();
    } catch (err) {
      setError('root', {
        type: 'manual',
        message: err instanceof Error ? err.message : 'Failed to create task',
      });
    }
  };

  return (
    <div className={cn("bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm", className)}>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Task</h2>

      {errors.root && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200">
          {errors.root.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            {...register('title')}
            className={cn(
              "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white",
              errors.title
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 dark:border-gray-600"
            )}
            placeholder="What needs to be done?"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {data.title?.length || 0}/200 characters
          </p>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            {...register('description')}
            rows={3}
            className={cn(
              "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white",
              errors.description
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 dark:border-gray-600"
            )}
            placeholder="Add details..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {data.description?.length || 0}/1000 characters
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              {...register('dueDate')}
              className={cn(
                "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white",
                errors.dueDate
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              )}
            />
            {errors.dueDate && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.dueDate.message}</p>
            )}
          </div>

          <div className="relative" ref={categoryRef}>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <input
              type="text"
              id="category"
              {...register('category')}
              className={cn(
                "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white",
                errors.category
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              )}
              placeholder="Work, Personal, etc."
              onFocus={() => setShowCategorySuggestions(true)}
              onChange={(e) => {
                register('category').onChange(e);
                if (e.target.value) {
                  setShowCategorySuggestions(true);
                }
              }}
            />
            {errors.category && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category.message}</p>
            )}
            {/* Category suggestions dropdown */}
            {showCategorySuggestions && data.category && categories.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                {categories
                  .filter(cat =>
                    cat.toLowerCase().includes(data.category?.toLowerCase() || '')
                  )
                  .map((category, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-gray-200"
                      onClick={() => {
                        // Update the category field with the selected value
                        const field = register('category');
                        field.onChange({ target: { value: category } });
                        setShowCategorySuggestions(false);
                      }}
                    >
                      {category}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        <div className="relative" ref={tagsRef}>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tags
          </label>
          <input
            type="text"
            id="tags"
            {...register('tags')}
            className={cn(
              "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white",
              errors.tags
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 dark:border-gray-600"
            )}
            placeholder="comma, separated, tags"
            onFocus={() => setShowTagSuggestions(true)}
            onChange={(e) => {
              register('tags').onChange(e);
              if (e.target.value) {
                setShowTagSuggestions(true);
              }
            }}
          />
          {errors.tags && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tags.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Separate tags with commas
          </p>
          {/* Tag suggestions dropdown */}
          {showTagSuggestions && data.tags && tags.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
              {tags
                .filter(tag =>
                  tag.toLowerCase().includes(data.tags?.toLowerCase() || '') &&
                  !data.tags?.split(',').map(t => t.trim()).includes(tag) // Don't show already selected tags
                )
                .map((tag, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-gray-200"
                    onClick={() => {
                      // Add the selected tag to the current tags
                      const currentTags = data.tags ? data.tags.split(',').map(t => t.trim()) : [];
                      if (!currentTags.includes(tag)) {
                        const newTags = [...currentTags, tag].join(', ');
                        const field = register('tags');
                        field.onChange({ target: { value: newTags } });
                      }
                      setShowTagSuggestions(false);
                    }}
                  >
                    {tag}
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            {isSubmitting ? 'Adding...' : 'Add Task'}
          </button>
        </div>
      </form>
    </div>
  );
}