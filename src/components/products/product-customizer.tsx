'use client';

import { useState, useRef, type MouseEvent, type ChangeEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import type { Product, CustomizationElement } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Text, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';

interface ProductCustomizerProps {
  product: Product;
}

const textSchema = z.object({
  text: z.string().min(1, 'Text cannot be empty.').max(50, 'Text is too long.'),
});

export default function ProductCustomizer({ product }: ProductCustomizerProps) {
  const [elements, setElements] = useState<CustomizationElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const { dispatch } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const customizerRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<{ text: string }>({
    resolver: zodResolver(textSchema),
  });

  const addElement = (type: 'image' | 'text', content: string) => {
    const newElement: CustomizationElement = {
      id: `${type}-${Date.now()}`,
      type,
      content,
      position: { x: 50, y: 50 },
      size: type === 'image' ? { width: 150, height: 150 } : { width: 200, height: 50 },
      rotation: 0,
      scale: 1,
    };
    setElements([...elements, newElement]);
    setSelectedElementId(newElement.id);
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          addElement('image', event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddText = handleSubmit((data) => {
    addElement('text', data.text);
    reset();
  });

  const removeElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  };
  
  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { product, quantity: 1, customization: elements }
    });
    toast({
      title: 'Added to Cart',
      description: `${product.name} has been added to your cart.`,
    });
    router.push('/cart');
  };

  const handleDragStart = (e: MouseEvent<HTMLDivElement>, id: string) => {
    e.preventDefault();
    setSelectedElementId(id);

    const element = e.currentTarget;
    const startPos = { x: e.clientX, y: e.clientY };
    const startElementPos = { x: element.offsetLeft, y: element.offsetTop };

    const handleMouseMove = (moveEvent: globalThis.MouseEvent) => {
      const dx = moveEvent.clientX - startPos.x;
      const dy = moveEvent.clientY - startPos.y;
      
      setElements(prevElements => prevElements.map(el => 
        el.id === id ? { ...el, position: { x: startElementPos.x + dx, y: startElementPos.y + dy } } : el
      ));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <Card>
          <CardContent className="p-4">
            <div ref={customizerRef} className="relative aspect-square w-full bg-muted/50 rounded-lg overflow-hidden">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-contain pointer-events-none"
                priority
              />
              {elements.map((el) => (
                <div
                  key={el.id}
                  className={`absolute cursor-move p-1 ${selectedElementId === el.id ? 'border-2 border-dashed border-primary' : 'border-2 border-transparent'}`}
                  style={{ left: el.position.x, top: el.position.y, width: el.size.width, height: el.size.height, transform: `rotate(${el.rotation}deg) scale(${el.scale})` }}
                  onMouseDown={(e) => handleDragStart(e, el.id)}
                  onClick={() => setSelectedElementId(el.id)}
                >
                  {el.type === 'image' ? (
                    <Image src={el.content} alt="Custom upload" layout="fill" className="object-contain" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-center text-2xl font-bold break-words">
                      {el.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold text-lg">Customize</h3>
            <div className="space-y-2">
              <Label htmlFor="image-upload">Add Image</Label>
              <Input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} />
            </div>
            <form onSubmit={handleAddText} className="space-y-2">
              <Label htmlFor="text-input">Add Text</Label>
              <div className="flex gap-2">
                <Input id="text-input" {...register('text')} placeholder="Your Text" />
                <Button type="submit" size="icon"><Plus /></Button>
              </div>
              {errors.text && <p className="text-sm text-destructive">{errors.text.message}</p>}
            </form>
          </CardContent>
        </Card>

        {elements.length > 0 && (
          <Card>
            <CardContent className="p-4 space-y-2">
              <h3 className="font-semibold text-lg">Layers</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {elements.map(el => (
                  <div key={el.id} className={`flex items-center justify-between p-2 rounded-md ${selectedElementId === el.id ? 'bg-accent/20' : 'bg-muted/50'}`}>
                    <div className="flex items-center gap-2">
                      {el.type === 'image' ? <ImageIcon className="h-4 w-4" /> : <Text className="h-4 w-4" />}
                      <span className="text-sm truncate max-w-[100px]">{el.type === 'text' ? el.content : 'Image'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" onClick={() => removeElement(el.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Button onClick={handleAddToCart} size="lg" className="w-full">
          Add to Cart - ${product.price.toFixed(2)}
        </Button>
      </div>
    </div>
  );
}
