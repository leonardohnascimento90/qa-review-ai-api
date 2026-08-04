const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const { initializeRepository } = require('./repositories');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const bugReviewRoutes = require('./routes/bugReviewRoutes');
const severityRoutes = require('./routes/severityRoutes');
const { errorHandler } = require('./middlewares/errorMiddleware');

const app = express();
const swaggerDocument = YAML.load(path.join(__dirname, 'resources', 'swagger.yaml'));

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

initializeRepository();

app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok' }));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bug-reviews', bugReviewRoutes);
app.use('/api/severities', severityRoutes);
app.use(errorHandler);

module.exports = app;
