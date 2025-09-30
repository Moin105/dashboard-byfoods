'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import { motion } from 'framer-motion'
import { X, Plus, Upload } from 'lucide-react'
import { api } from '@/lib/api'
import { Bar } from '@/lib/types'
import toast from 'react-hot-toast'

interface BarFormProps {
  bar?: Bar | null
  onSuccess: () => void
  onCancel: () => void
}

interface BarFormData {
  name: string
  type: string
  location: string
  image: string
  priceRange: string
  specialties: string[]
  description: string
  address: string
  phone: string
  website: string
  rating: number
  reviews: number
  isOpen: boolean
  isActive: boolean
}

export function BarForm({ bar, onSuccess, onCancel }: BarFormProps) {
  const [specialties, setSpecialties] = useState<string[]>(bar?.specialties || [])
  const [newSpecialty, setNewSpecialty] = useState('')
  const [uploading, setUploading] = useState(false)
  const queryClient = useQueryClient()

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<BarFormData>({
    defaultValues: {
      name: bar?.name || '',
      type: bar?.type || '',
      location: bar?.location || '',
      image: bar?.image || '',
      priceRange: bar?.priceRange || '',
      description: bar?.description || '',
      address: bar?.address || '',
      phone: bar?.phone || '',
      website: bar?.website || '',
      rating: bar?.rating || 0,
      reviews: bar?.reviews || 0,
      isOpen: bar?.isOpen || true,
      isActive: bar?.isActive || true,
    }
  })

  const createMutation = useMutation(
    (data: BarFormData) => api.post('/bars', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('bars')
        onSuccess()
      },
      onError: () => {
        toast.error('Failed to create bar')
      },
    }
  )

  const updateMutation = useMutation(
    (data: BarFormData) => api.patch(`/bars/${bar?.id}`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('bars')
        onSuccess()
      },
      onError: () => {
        toast.error('Failed to update bar')
      },
    }
  )

  const handleImageUpload = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      setValue('image', response.data.url)
      toast.success('Image uploaded successfully')
    } catch (error) {
      toast.error('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const addSpecialty = () => {
    if (newSpecialty.trim() && !specialties.includes(newSpecialty.trim())) {
      setSpecialties([...specialties, newSpecialty.trim()])
      setNewSpecialty('')
    }
  }

  const removeSpecialty = (index: number) => {
    setSpecialties(specialties.filter((_, i) => i !== index))
  }

  const onSubmit = (data: BarFormData) => {
    const submitData = {
      ...data,
      specialties,
    }

    if (bar) {
      updateMutation.mutate(submitData)
    } else {
      createMutation.mutate(submitData)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
          
          <div>
            <label className="label">Bar Name *</label>
            <input
              {...register('name', { required: 'Bar name is required' })}
              className="input-field"
              placeholder="Enter bar name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="label">Type *</label>
            <select {...register('type', { required: 'Type is required' })} className="input-field">
              <option value="">Select type</option>
              <option value="Cocktail Bar">Cocktail Bar</option>
              <option value="Speakeasy">Speakeasy</option>
              <option value="Rooftop Bar">Rooftop Bar</option>
              <option value="Whiskey Bar">Whiskey Bar</option>
              <option value="Nightclub">Nightclub</option>
              <option value="Wine Bar">Wine Bar</option>
              <option value="Sports Bar">Sports Bar</option>
            </select>
            {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
          </div>

          <div>
            <label className="label">Location *</label>
            <input
              {...register('location', { required: 'Location is required' })}
              className="input-field"
              placeholder="Enter location"
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
          </div>

          <div>
            <label className="label">Price Range *</label>
            <select {...register('priceRange', { required: 'Price range is required' })} className="input-field">
              <option value="">Select price range</option>
              <option value="$">$ - Budget</option>
              <option value="$$">$$ - Moderate</option>
              <option value="$$$">$$$ - Expensive</option>
              <option value="$$$$">$$$$ - Very Expensive</option>
            </select>
            {errors.priceRange && <p className="text-red-500 text-sm mt-1">{errors.priceRange.message}</p>}
          </div>
        </div>

        {/* Image and Status */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Image & Status</h3>
          
          <div>
            <label className="label">Bar Image *</label>
            <div className="space-y-2">
              <input
                {...register('image', { required: 'Image is required' })}
                className="input-field"
                placeholder="Image URL or upload file"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageUpload(file)
                }}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="btn-secondary cursor-pointer inline-flex items-center"
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Image'}
              </label>
            </div>
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Rating</label>
              <input
                {...register('rating', { valueAsNumber: true })}
                type="number"
                step="0.1"
                min="0"
                max="5"
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Reviews</label>
              <input
                {...register('reviews', { valueAsNumber: true })}
                type="number"
                min="0"
                className="input-field"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center">
              <input
                {...register('isOpen')}
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Currently Open</span>
            </label>
            <label className="flex items-center">
              <input
                {...register('isActive')}
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
            </label>
          </div>
        </div>
      </div>

      {/* Specialties */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Specialties</h3>
        <div className="space-y-3">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newSpecialty}
              onChange={(e) => setNewSpecialty(e.target.value)}
              placeholder="Add specialty"
              className="input-field flex-1"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
            />
            <button
              type="button"
              onClick={addSpecialty}
              className="btn-primary"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {specialties.map((specialty, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
              >
                {specialty}
                <button
                  type="button"
                  onClick={() => removeSpecialty(index)}
                  className="ml-2 text-primary-600 hover:text-primary-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Additional Information</h3>
        
        <div>
          <label className="label">Description</label>
          <textarea
            {...register('description')}
            rows={3}
            className="input-field"
            placeholder="Enter bar description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Address</label>
            <input
              {...register('address')}
              className="input-field"
              placeholder="Enter full address"
            />
          </div>
          <div>
            <label className="label">Phone</label>
            <input
              {...register('phone')}
              className="input-field"
              placeholder="Enter phone number"
            />
          </div>
        </div>

        <div>
          <label className="label">Website</label>
          <input
            {...register('website')}
            type="url"
            className="input-field"
            placeholder="https://example.com"
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={createMutation.isLoading || updateMutation.isLoading}
          className="btn-primary disabled:opacity-50"
        >
          {createMutation.isLoading || updateMutation.isLoading
            ? 'Saving...'
            : bar
            ? 'Update Bar'
            : 'Create Bar'}
        </button>
      </div>
    </form>
  )
}
