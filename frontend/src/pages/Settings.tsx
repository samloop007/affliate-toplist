import React, { useState, useEffect } from 'react';
import { PartnerConfig, Destination, ToplistResponse } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { ColorPicker } from '@/components/ColorPicker';

const Settings: React.FC = () => {
  const [config, setConfig] = useState<PartnerConfig>({
    id: '',
    domain: window.location.hostname,
    departure: '',
    destinationIds: [],
    layout: '1-column',
    colors: {
      text: '#000000',
      background: '#ffffff',
    },
    toplistType: 'charter',
    limit: 10,
  });

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [preview, setPreview] = useState<ToplistResponse | null>(null);

  useEffect(() => {
    // Fetch destinations
    fetch('/api/destinations')
      .then(res => res.json())
      .then(data => setDestinations(data))
      .catch(console.error);

    // Load existing config
    fetch('/api/config')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(console.error);
  }, []);

  const handleSave = async () => {
    try {
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    }
  };

  const handlePreview = async () => {
    try {
      const response = await fetch(`/api/preview?type=${config.toplistType}&limit=${config.limit}`);
      const data = await response.json();
      setPreview(data);
    } catch (error) {
      console.error('Error fetching preview:', error);
      alert('Error fetching preview');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Toplist Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="departure">Departure Location</Label>
              <Input
                id="departure"
                value={config.departure}
                onChange={e => setConfig({ ...config, departure: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="toplistType">Toplist Type</Label>
              <Select
                value={config.toplistType}
                onValueChange={value => setConfig({ ...config, toplistType: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="charter">Charter</SelectItem>
                  <SelectItem value="last_minute">Last Minute</SelectItem>
                  <SelectItem value="air">Air</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="layout">Layout</Label>
              <Select
                value={config.layout}
                onValueChange={value => setConfig({ ...config, layout: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-column">1 Column</SelectItem>
                  <SelectItem value="2-column">2 Columns</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Colors</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Text Color</Label>
                  <ColorPicker
                    color={config.colors.text}
                    onChange={color => setConfig({
                      ...config,
                      colors: { ...config.colors, text: color },
                    })}
                  />
                </div>
                <div>
                  <Label>Background Color</Label>
                  <ColorPicker
                    color={config.colors.background}
                    onChange={color => setConfig({
                      ...config,
                      colors: { ...config.colors, background: color },
                    })}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="limit">Number of Items</Label>
              <Input
                id="limit"
                type="number"
                value={config.limit}
                onChange={e => setConfig({ ...config, limit: parseInt(e.target.value) })}
              />
            </div>

            <div className="flex gap-4">
              <Button onClick={handleSave}>Save Settings</Button>
              <Button onClick={handlePreview} variant="outline">Preview</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {preview && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <iframe
              src={`/api/toplist/${config.toplistType}?limit=${config.limit}`}
              className="w-full h-[500px] border-0"
              title="Toplist Preview"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Settings; 