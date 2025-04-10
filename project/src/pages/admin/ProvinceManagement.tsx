import React, { useState, useEffect } from 'react';
import { 
  useReactTable, 
  getCoreRowModel, 
  createColumnHelper, 
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface Province {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

interface EditableRowProps {
  province: Province;
  onSave: (province: Province) => void;
  onCancel: () => void;
}

function EditableRow({ province, onSave, onCancel }: EditableRowProps) {
  const [name, setName] = useState(province.name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...province, name });
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 px-3 py-1 border rounded"
        autoFocus
      />
      <button
        type="submit"
        className="p-1 text-green-600 hover:text-green-800"
      >
        <Check size={16} />
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="p-1 text-red-600 hover:text-red-800"
      >
        <X size={16} />
      </button>
    </form>
  );
}

export function ProvinceManagement() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);

  const columnHelper = createColumnHelper<Province>();

  const columns = [
    columnHelper.accessor('name', {
      header: 'Nom de la Province',
      cell: ({ row, getValue }) => (
        editingId === row.original.id ? (
          <EditableRow
            province={row.original}
            onSave={handleSaveEdit}
            onCancel={() => setEditingId(null)}
          />
        ) : (
          getValue()
        )
      ),
    }),
    columnHelper.accessor('created_at', {
      header: 'Date de création',
      cell: ({ getValue }) => getValue().toLocaleDateString('fr-FR'),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditingId(row.original.id)}
            className="p-1 text-blue-600 hover:text-blue-800"
            title="Modifier"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => handleDeleteProvince(row.original.id)}
            className="p-1 text-red-600 hover:text-red-800"
            title="Supprimer"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: provinces,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const fetchProvinces = async () => {
    try {
      const provincesRef = collection(db, 'provinces');
      const q = query(provincesRef, orderBy('name'));
      const querySnapshot = await getDocs(q);
      
      const provincesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at.toDate(),
        updated_at: doc.data().updated_at.toDate()
      })) as Province[];

      setProvinces(provincesData);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des provinces');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  const handleAddProvince = async () => {
    const name = prompt('Entrez le nom de la province:');
    if (!name) return;

    try {
      const provincesRef = collection(db, 'provinces');
      await addDoc(provincesRef, {
        name,
        created_at: new Date(),
        updated_at: new Date()
      });
      
      fetchProvinces();
      setError(null);
    } catch (err) {
      setError('Erreur lors de l\'ajout de la province');
      console.error('Error:', err);
    }
  };

  const handleSaveEdit = async (province: Province) => {
    try {
      const provinceRef = doc(db, 'provinces', province.id);
      await updateDoc(provinceRef, {
        name: province.name,
        updated_at: new Date()
      });
      
      setEditingId(null);
      fetchProvinces();
      setError(null);
    } catch (err) {
      setError('Erreur lors de la modification de la province');
      console.error('Error:', err);
    }
  };

  const handleDeleteProvince = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette province ?')) return;

    try {
      const provinceRef = doc(db, 'provinces', id);
      await deleteDoc(provinceRef);
      
      fetchProvinces();
      setError(null);
    } catch (err) {
      setError('Erreur lors de la suppression de la province');
      console.error('Error:', err);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestion des Provinces</h1>
          <button
            onClick={handleAddProvince}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Ajouter une Province
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <td
                        key={cell.id}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
              >
                Précédent
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
            <span className="text-sm text-gray-700">
              Page {table.getState().pagination.pageIndex + 1} sur{' '}
              {table.getPageCount()}
            </span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );