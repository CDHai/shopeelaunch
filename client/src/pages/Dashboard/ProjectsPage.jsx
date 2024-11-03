import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { PlusIcon } from '@heroicons/react/24/outline';

const ProjectsPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  const startNewProject = () => {
    navigate('/dashboard/projects/new');
  };

  return (
    <DashboardLayout>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your Shopee business projects
          </p>
        </div>
        <button
          onClick={startNewProject}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="mt-8 text-center bg-white rounded-lg shadow py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No projects yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new project
          </p>
          <div className="mt-6">
            <button
              onClick={startNewProject}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create your first project
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

// Project Card Component
const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
      <div className="flex-1 bg-white p-6 flex flex-col justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-indigo-600">
            {project.category}
          </p>
          <div className="block mt-2">
            <p className="text-xl font-semibold text-gray-900">
              {project.name}
            </p>
            <p className="mt-3 text-base text-gray-500">
              {project.description}
            </p>
          </div>
        </div>
        <div className="mt-6 flex items-center">
          <div className="flex-shrink-0">
            <div className="flex space-x-2">
              <span className={`px-2 py-1 text-xs rounded-full ${
                project.status === 'completed' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {project.status}
              </span>
              <span className="text-sm text-gray-500">
                Step {project.currentStep}/7
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 p-4">
        <button
          onClick={() => navigate(`/dashboard/projects/${project._id}`)}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          Continue Project <span aria-hidden="true">&rarr;</span>
        </button>
      </div>
    </div>
  );
};

export default ProjectsPage;