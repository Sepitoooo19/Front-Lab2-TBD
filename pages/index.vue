<!-- pagina principal redirigida al login-->
<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

router.push('/login'); // Redirige automáticamente al login
</script>