import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Image,
  Video,
  Folder,
  Search,
  Filter,
  Grid3X3,
  List,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Download,
  Calendar,
  Clock,
  Tag,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminLayout } from '@/components/admin/AdminLayout';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock content data
const contentItems = [
  {
    id: '1',
    title: 'Getting Started with Zenith',
    type: 'article',
    status: 'published',
    author: 'John Doe',
    createdAt: '2024-06-15',
    updatedAt: '2024-06-18',
    views: 1250,
  },
  {
    id: '2',
    title: 'Product Launch Announcement',
    type: 'article',
    status: 'published',
    author: 'Jane Smith',
    createdAt: '2024-06-10',
    updatedAt: '2024-06-10',
    views: 890,
  },
  {
    id: '3',
    title: 'Advanced Automation Guide',
    type: 'article',
    status: 'draft',
    author: 'Mike Johnson',
    createdAt: '2024-06-18',
    updatedAt: '2024-06-20',
    views: 0,
  },
  {
    id: '4',
    title: 'Team Onboarding Course',
    type: 'course',
    status: 'published',
    author: 'John Doe',
    createdAt: '2024-05-20',
    updatedAt: '2024-06-05',
    views: 450,
  },
  {
    id: '5',
    title: 'Q3 Marketing Strategy',
    type: 'page',
    status: 'scheduled',
    author: 'Jane Smith',
    createdAt: '2024-06-19',
    updatedAt: '2024-06-19',
    views: 0,
    scheduledFor: '2024-07-01',
  },
];

const mediaItems = [
  { id: '1', name: 'hero-banner.jpg', type: 'image', size: '2.4 MB', uploadedAt: '2024-06-15' },
  { id: '2', name: 'product-demo.mp4', type: 'video', size: '45.2 MB', uploadedAt: '2024-06-14' },
  { id: '3', name: 'team-photo.png', type: 'image', size: '1.8 MB', uploadedAt: '2024-06-12' },
  { id: '4', name: 'logo-white.svg', type: 'image', size: '24 KB', uploadedAt: '2024-06-10' },
  { id: '5', name: 'intro-video.mp4', type: 'video', size: '128 MB', uploadedAt: '2024-06-08' },
  { id: '6', name: 'infographic.png', type: 'image', size: '3.1 MB', uploadedAt: '2024-06-05' },
];

const courses = [
  {
    id: '1',
    title: 'Introduction to Platform',
    lessons: 12,
    students: 45,
    status: 'published',
    progress: 100,
  },
  {
    id: '2',
    title: 'Advanced Content Strategy',
    lessons: 8,
    students: 23,
    status: 'published',
    progress: 100,
  },
  {
    id: '3',
    title: 'Automation Masterclass',
    lessons: 5,
    students: 0,
    status: 'draft',
    progress: 60,
  },
];

const statusColors = {
  published: 'bg-green-500/10 text-green-500',
  draft: 'bg-yellow-500/10 text-yellow-500',
  scheduled: 'bg-blue-500/10 text-blue-500',
  archived: 'bg-gray-500/10 text-gray-500',
};

const typeIcons = {
  article: FileText,
  course: Folder,
  page: FileText,
  image: Image,
  video: Video,
};

export default function ContentManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredContent = contentItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Content Management</h1>
            <p className="text-muted-foreground">Manage all your content, media, and courses</p>
          </div>
          <Button>
            <Plus size={16} className="mr-2" />
            Create Content
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Content', value: contentItems.length, icon: FileText, color: 'text-blue-500' },
            { label: 'Published', value: contentItems.filter(c => c.status === 'published').length, icon: Eye, color: 'text-green-500' },
            { label: 'Media Files', value: mediaItems.length, icon: Image, color: 'text-purple-500' },
            { label: 'Courses', value: courses.length, icon: Folder, color: 'text-orange-500' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <stat.icon size={20} className={stat.color} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Content</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="media">Media Library</TabsTrigger>
          </TabsList>

          {/* All Content Tab */}
          <TabsContent value="all" className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative flex-1 w-full sm:max-w-sm">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search content..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex border border-border rounded-md">
                  <Button
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                  >
                    <List size={16} />
                  </Button>
                  <Button
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 size={16} />
                  </Button>
                </div>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {filteredContent.map((item, index) => {
                    const TypeIcon = typeIcons[item.type as keyof typeof typeIcons] || FileText;
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                            <TypeIcon size={20} className="text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{item.title}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{item.author}</span>
                              <span>•</span>
                              <span>{item.updatedAt}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <Badge className={statusColors[item.status as keyof typeof statusColors]}>
                            {item.status}
                          </Badge>
                          {item.views > 0 && (
                            <span className="text-sm text-muted-foreground hidden sm:flex items-center gap-1">
                              <Eye size={14} />
                              {item.views.toLocaleString()}
                            </span>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit size={14} className="mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye size={14} className="mr-2" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <ExternalLink size={14} className="mr-2" />
                                View Live
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 size={14} className="mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Folder size={20} className="text-primary" />
                        </div>
                        <Badge className={statusColors[course.status as keyof typeof statusColors]}>
                          {course.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-base mt-3">{course.title}</CardTitle>
                      <CardDescription>
                        {course.lessons} lessons • {course.students} students
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Completion</span>
                          <span className="font-medium">{course.progress}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                      <Button variant="outline" className="w-full mt-4">
                        Manage Course
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: courses.length * 0.1 }}
              >
                <Card className="border-dashed hover:border-primary transition-colors cursor-pointer h-full flex items-center justify-center min-h-[200px]">
                  <CardContent className="text-center">
                    <Plus size={32} className="mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Create New Course</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Media Library Tab */}
          <TabsContent value="media" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search media..." className="pl-9" />
              </div>
              <Button>
                <Plus size={16} className="mr-2" />
                Upload Media
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {mediaItems.map((item, index) => {
                const TypeIcon = item.type === 'video' ? Video : Image;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="group overflow-hidden hover:shadow-md transition-all cursor-pointer">
                      <div className="aspect-square bg-muted flex items-center justify-center relative">
                        <TypeIcon size={32} className="text-muted-foreground" />
                        <div className="absolute inset-0 bg-foreground/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button size="icon" variant="secondary" className="h-8 w-8">
                            <Eye size={14} />
                          </Button>
                          <Button size="icon" variant="secondary" className="h-8 w-8">
                            <Download size={14} />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.size}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}