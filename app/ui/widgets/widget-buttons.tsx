import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteWidget } from '@/app/lib/actions';

export function CreateWidget() {
  return (
    <Link
      href="/dashboard/settings/create"
      className="flex h-10 items-center justify-between rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Widget</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateWidget({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/settings/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteWidget({ id }: { id: string }) {
  const deleteWidgetWithId = deleteWidget.bind(null, id);
  return (
    <form action={deleteWidgetWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}