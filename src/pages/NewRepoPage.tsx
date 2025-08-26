import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Book, Lock } from 'lucide-react';
const newRepoSchema = z.object({
  name: z.string().min(1, 'Repository name is required').max(100),
  description: z.string().max(300).optional(),
  isPrivate: z.boolean(),
});
type NewRepoFormValues = z.infer<typeof newRepoSchema>;
export function NewRepoPage() {
  const navigate = useNavigate();
  const { currentUser, addRepository } = useAuthStore();
  const form = useForm<NewRepoFormValues>({
    resolver: zodResolver(newRepoSchema),
    defaultValues: {
      name: '',
      description: '',
      isPrivate: false,
    },
  });
  const onSubmit = (data: NewRepoFormValues) => {
    addRepository(data);
    navigate(`/${currentUser?.username}/${data.name}`);
  };
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-2 pb-6 border-b">
        <h1 className="text-2xl font-bold">Create a new repository</h1>
        <p className="text-muted-foreground">A repository contains all project files, including the revision history.</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-6">
          <div className="flex items-center space-x-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Repository name</FormLabel>
                  <FormControl>
                    <Input placeholder="my-awesome-project" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description <span className="text-muted-foreground">(optional)</span></FormLabel>
                <FormControl>
                  <Textarea placeholder="A short description of your project." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isPrivate"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <RadioGroup
                  onValueChange={(value) => field.onChange(value === 'true')}
                  defaultValue={field.value.toString()}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-start space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="false" />
                    </FormControl>
                    <div className="space-y-1">
                      <FormLabel className="font-normal flex items-center"><Book className="h-4 w-4 mr-2" /> Public</FormLabel>
                      <FormDescription>Anyone on the internet can see this repository. You choose who can commit.</FormDescription>
                    </div>
                  </FormItem>
                  <FormItem className="flex items-start space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="true" />
                    </FormControl>
                    <div className="space-y-1">
                      <FormLabel className="font-normal flex items-center"><Lock className="h-4 w-4 mr-2" /> Private</FormLabel>
                      <FormDescription>You choose who can see and commit to this repository.</FormDescription>
                    </div>
                  </FormItem>
                </RadioGroup>
              </FormItem>
            )}
          />
          <Button type="submit">Create repository</Button>
        </form>
      </Form>
    </div>
  );
}